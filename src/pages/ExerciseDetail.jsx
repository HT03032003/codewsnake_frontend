import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import '../styles/codeEditor.css';
import '../styles/exerciseDetail.css';

function ExerciseDetail() {
    const { id } = useParams();
    const [exercise, setExercise] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [errors, setErrors] = useState('');
    const [requiresInput, setRequiresInput] = useState(false);
    const [userInputs, setUserInputs] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchExercise = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/exercises/${id}/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                if (response.status === 403) {
                    navigate("/exercise");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Lỗi server: ${response.status}`);
                }

                const data = await response.json();
                setExercise(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài tập:", error);
            }
        };

        fetchExercise();
    }, [id, navigate]);

    useEffect(() => {
        if (requiresInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [requiresInput]);

    const extractPromptsFromCode = (code) => {
        const promptRegex = /input\((['"])?(.*?)\1?\)/g;
        let match;
        const prompts = [];
        while ((match = promptRegex.exec(code)) !== null) {
            prompts.push(match[2] || "");
        }
        return prompts;
    };

    const handleEditorChange = (value) => {
        setCode(value);
        setOutput('');
        setErrors('');
        setRequiresInput(false);
        setUserInputs([]);
        setUserInput('');
        setCurrentPrompt('');
    };

    const runCode = () => {
        setUserInputs([]);
        setUserInput('');
        setOutput('Đang chạy mã...');
        setRequiresInput(false);
        const prompts = extractPromptsFromCode(code);
        setCurrentPrompt(prompts[0] || '');

        axios
            .post(`${process.env.REACT_APP_API_URL}/practice/run_code/`, { code, inputs: [] })
            .then((response) => {
                const { output, requiresInput } = response.data;
                setOutput(output);
                setRequiresInput(requiresInput || false);
            })
            .catch((error) => {
                if (error.response && error.response.data.output) {
                    setOutput(error.response.data.output);
                } else {
                    setOutput('Lỗi khi chạy mã.');
                }
                console.error(error);
            });
    };

    const handleUserInput = () => {
        const newInputs = [...userInputs, userInput];
        const prompts = extractPromptsFromCode(code);
        const newPrompt = prompts[newInputs.length - 1] || "";
        const labelPrompt = prompts[newInputs.length] || "";

        setUserInputs(newInputs);
        setUserInput('');
        setRequiresInput(false);
        setCurrentPrompt(labelPrompt);

        axios
            .post(`${process.env.REACT_APP_API_URL}/practice/run_code/`, {
                code,
                inputs: newInputs,
            })
            .then((response) => {
                const { output: fullOutput, requiresInput } = response.data;
                const localEcho = `${newPrompt}${userInput}\n`;
                setOutput(prev => prev + localEcho + fullOutput);
                setRequiresInput(requiresInput || false);
            })
            .catch((error) => {
                if (error.response && error.response.data.output) {
                    setOutput(prev => prev + '\n' + error.response.data.output);
                } else {
                    setOutput(prev => prev + '\nLỗi khi gửi input.');
                }
            });
    };

    const checkCode = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate("/login");
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/exercises/check-code/${id}/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        })
            .then(response => response.json())
            .then(data => {
                const safeResult = typeof data.result === 'string' ? data.result.trim() : 'Không có kết quả';
                setOutput(safeResult);

                if (safeResult.toLowerCase() === 'success') {
                    setTimeout(launchConfetti, 0);
                }
            })
            .catch(error => {
                console.error('Lỗi:', error);
                setOutput('Có lỗi xảy ra trong quá trình kiểm tra.');
            });
    };

    const launchConfetti = () => {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#bb00bb'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            }
        })();
    };

    if (!exercise) return <p>Loading...</p>;

    return (
        <div className="detail-page">
            <div className="exercise-description">
                <h4>Bài tập</h4>
                <div className='question-text'>
                    <h2>{exercise?.title}</h2>
                    <p>{exercise?.description}</p>
                    <p>{exercise?.question_text}</p>
                    <p>Difficulty: {exercise?.difficulty}</p>
                    <p>XP: {exercise?.difficulty === 'dễ' ? 'x5' : exercise?.difficulty === 'trung bình' ? 'x10' : 'x15'} XP</p>
                </div>
            </div>
            <div className="container">
                <div className="controls">
                    <button onClick={runCode} className="btn">Chạy code</button>
                    <button className='btn' onClick={checkCode}>Kiểm tra mã</button>
                </div>
                <div className="editor-container">
                    <Editor
                        language="python"
                        value={code}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        height="400px"
                        options={{
                            fontSize: 14,
                            fontFamily: 'Orbitron, sans-serif',
                            minimap: { enabled: false },
                            wordWrap: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            lineNumbers: 'on',
                            renderLineHighlight: 'all',
                            tabSize: 4,
                            background: 'transparent'
                        }}
                    />
                </div>
                <div className="terminal">
                    <h4 className='terminal-title'>Terminal Output:</h4>
                    <pre>
                        {requiresInput && (
                            <div className="input-section">
                                <label>{currentPrompt}</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Nhập dữ liệu"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUserInput();
                                    }}
                                />
                            </div>
                        )}
                        {output}
                    </pre>
                    {errors && <p style={{ color: 'red' }}>{errors}</p>}
                </div>
            </div>
        </div>
    );
}

export default ExerciseDetail;