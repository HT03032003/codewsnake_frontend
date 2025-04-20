import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faUpload, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/codeEditor.css';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState('');
  const [requiresInput, setRequiresInput] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const navigate = useNavigate();
  const prevOutputRef = useRef('');
  const inputRef = useRef(null);

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
    prevOutputRef.current = '';
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
        prevOutputRef.current = output;
        setRequiresInput(requiresInput || false);
      })
      .catch((error) => {
        const errorOutput = error.response?.data?.output || 'Lỗi khi chạy mã.';
        setOutput(errorOutput);
        prevOutputRef.current = errorOutput;
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
        const newPart = fullOutput.replace(prevOutputRef.current, '');
        const localEcho = `${newPrompt}${userInput}\n`;
        prevOutputRef.current = fullOutput;
        setOutput(prev => prev + localEcho + newPart);
        setRequiresInput(requiresInput || false);
      })
      .catch((error) => {
        const errorOutput = error.response?.data?.output || 'Lỗi khi gửi input.';
        setOutput(prev => prev + '\n' + errorOutput);
      });
  };

  const handleCodeCorrection = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate("/login");
    }

    axios.post(`${process.env.REACT_APP_API_URL}/practice/correct_code/`, { code })
      .then(response => {
        if (response.data.corrected_code) {
          setCode(response.data.corrected_code);
          setErrors('');
        } else {
          setErrors('Không tìm thấy lỗi nào trong mã.');
        }
      })
      .catch(err => {
        setErrors('Lỗi: ' + (err.response?.data?.error || 'Không thể kết nối đến API.'));
      });
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCode(reader.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="container">
      <div className="controls">
        <button onClick={runCode} className="control-button run" data-tooltip="Chạy code">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={() => document.getElementById('upload-file').click()} className="control-button upload" data-tooltip="Tải lên file">
          <FontAwesomeIcon icon={faUpload} />
        </button>
        <button onClick={handleCodeCorrection} className="control-button edit" data-tooltip="Gợi ý sửa lỗi">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>

      <div className="editor-container editor-boder">
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUserInput();
                  }
                }}
                placeholder="Nhập dữ liệu"
              />
            </div>
          )}
          {output}
        </pre>
        {errors && <p style={{ color: 'red' }}>{errors}</p>}
      </div>

      <input
        id="upload-file"
        type="file"
        accept=".txt,.py"
        onChange={uploadFile}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CodeEditor;