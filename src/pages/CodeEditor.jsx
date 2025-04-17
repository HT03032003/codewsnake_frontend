import React, { useState } from 'react';
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
  const navigate = useNavigate();

  const handleEditorChange = (value) => {
    setCode(value);
    setOutput('');
    setErrors('');
    setRequiresInput(false);
    setUserInputs([]);
    setUserInput('');
  };

  const runCode = () => {
    setUserInputs([]);
    setUserInput('');
    setOutput('Đang chạy mã...');
    setRequiresInput(false);

    axios
      .post(`${process.env.REACT_APP_API_URL}/practice/run_code/`, { code, inputs: [] })
      .then((response) => {
        const { output, requiresInput } = response.data;
        setOutput(output);
        setRequiresInput(requiresInput || false);
      })
      .catch((error) => {
        if (error.response && error.response.data.output) {
          setOutput(error.response.data.output);  // In ra thông báo lỗi chi tiết
        } else {
          setOutput('Lỗi khi chạy mã.');
        }
        console.error(error);
      });
  };


  const handleUserInput = () => {
    const newInputs = [...userInputs, userInput];
    setUserInputs(newInputs);
    setUserInput('');
    setRequiresInput(false); // Ẩn ô nhập liệu

    axios
      .post(`${process.env.REACT_APP_API_URL}/practice/run_code/`, { code, inputs: newInputs })
      .then((response) => {
        const { output, requiresInput } = response.data;
        setOutput(output || 'Mã không có kết quả');
        setRequiresInput(requiresInput || false);
      })
      .catch((error) => {
        if (error.response && error.response.data.output) {
          setOutput(error.response.data.output);  // In ra thông báo lỗi chi tiết
        } else {
          setOutput('Lỗi khi gửi input.');
        }
        console.error(error);
      });
  };

  const handleCodeCorrection = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate("/login");
    }

    axios.post(`${process.env.REACT_APP_API_URL}/practice/correct_code/`, { code: code })
      .then(response => {
        if (response.data.corrected_code) {
          setCode(response.data.corrected_code);
          setErrors('');
        } else {
          setErrors('No code errors found');
        }
      })
      .catch(err => {
        setErrors('Error: ' + (err.response?.data?.error || 'Unable to connect to API.'));
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
        <button onClick={runCode} className="control-button run">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={() => document.getElementById('upload-file').click()} className="control-button upload">
          <FontAwesomeIcon icon={faUpload} />
        </button>
        <button onClick={handleCodeCorrection} className="control-button edit">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
      <div className="editor-container editor-boder">
        <Editor
          language="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark" // Hoặc "vs-light", hoặc custom
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
            background: 'transparent',
          }}
        />

      </div>
      <div className="terminal">
        <h4 className='terminal-title'>Terminal Output:</h4>
        <pre>{requiresInput && (
          <div className="input-section">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập dữ liệu"
            />
            <button onClick={handleUserInput}>Gửi</button>
          </div>
        )}{output}</pre>
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
