import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

const AdminCreateQuestion = () => {
  const navigate = useNavigate();
  const [questionContent, setQuestionContent] = useState("");
  const [choices, setChoices] = useState([]);
  const { id } = useParams();
  
  const handleChangeChoice = (index, value) => {
    const updated = [...choices];
    updated[index].content = value;
    setChoices(updated);
  };

  const handleSetCorrect = (index) => {
    const updated = choices.map((choice, i) => ({
      ...choice,
      is_correct: i === index,
    }));
    setChoices(updated);
  };

  const handleAddChoice = () => {
    setChoices((prev) => [
      ...prev,
      { id: Date.now(), content: "", is_correct: false },
    ]);
  };

  const handleDeleteChoice = (index) => {
    const updated = [...choices];
    updated.splice(index, 1);
    setChoices(updated);
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
  
    const res = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/document/${id}/question/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: questionContent,
        choices: choices,
      }),
    });
  
    if (res.ok) {
      alert("✅ Tạo câu hỏi thành công!");
      navigate(`/admin/document/${id}/questions`);
    } else {
      const data = await res.json();
      alert("❌ Thất bại: " + (data.error || "Vui lòng kiểm tra dữ liệu!"));
    }
  };

  return (
    <Layout>
      <div className="admin-wrapper">
        <h2 className="admin-title">Tạo câu hỏi mới</h2>
        <div className="admin-card">
          <label><strong>Nội dung câu hỏi:</strong></label>
          <textarea
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: "15px" }}
          />

          <h4>Danh sách đáp án:</h4>
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="text"
                value={choice.content}
                onChange={(e) => handleChangeChoice(index, e.target.value)}
                placeholder={`Đáp án ${index + 1}`}
                style={{ flex: 1, marginRight: "10px" }}
              />
              <input
                type="radio"
                name="correctChoice"
                checked={choice.is_correct}
                onChange={() => handleSetCorrect(index)}
                title="Đáp án đúng"
              />
              <button
                className="admin-btn delete"
                onClick={() => handleDeleteChoice(index)}
                style={{ marginLeft: "10px" }}
              >
                X
              </button>
            </div>
          ))}

          <button className="admin-btn edit" onClick={handleAddChoice}>
            + Thêm đáp án
          </button>

          <div style={{ marginTop: "20px" }}>
            <button className="admin-btn save" onClick={handleSubmit}>
              💾 Lưu câu hỏi
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCreateQuestion;
