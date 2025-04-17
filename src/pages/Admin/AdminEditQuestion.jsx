import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Layout from "./Layout";

const AdminQuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dùng để chỉnh sửa
  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${process.env.REACT_APP_API_URL}/dashboard/question/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestion(res.data);
        setChoices(res.data.choices);
        setQuestionContent(res.data.content);
        setQuestionType(res.data.question_type);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy câu hỏi:", err);
        setLoading(false);
      });
  }, [id]);

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

  const handleChangeContent = (index, value) => {
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

  const handleUpdateQuestion = () => {
    const token = localStorage.getItem("accessToken");

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/dashboard/question/update/${id}/`,
        {
          content: questionContent,
          choices: choices.map((c) => ({
            id: typeof c.id === "number" ? c.id : undefined,
            content: c.content,
            is_correct: c.is_correct,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        alert("✅ Cập nhật thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật câu hỏi:", err);
        alert("❌ Có lỗi xảy ra khi cập nhật!");
      });
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <Layout>
      <div className="admin-wrapper">
        <h2 className="admin-title">Chi tiết câu hỏi</h2>

        {question ? (
          <div className="admin-card">
            <label><strong>Nội dung:</strong></label>
            <textarea
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              rows={3}
              style={{ width: "100%", marginBottom: "10px" }}
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
                  onChange={(e) => handleChangeContent(index, e.target.value)}
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
              <button className="admin-btn save" onClick={handleUpdateQuestion}>
                💾 Cập nhật câu hỏi
              </button>
              <Link to="/admin/exercises">
                <button className="admin-btn" style={{ marginLeft: "10px" }}>
                  Quay lại
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <p>Không tìm thấy câu hỏi!</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminQuestionDetail;
