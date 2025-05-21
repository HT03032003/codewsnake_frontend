import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Layout from "./Layout";

const AdminQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const { id } = useParams(); // id ở đây là id của tài liệu (document)

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios
            .get(`${process.env.REACT_APP_API_URL}/dashboard/document/${id}/questions/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setQuestions(res.data))
            .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
    }, [id]);

  const handleDelete = async (questionId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này không?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/question/delete/${questionId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuestions((prev) => prev.filter((question) => question.id !== questionId));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa bài tập:", error);
        alert("Không thể xóa! Kiểm tra quyền hoặc đăng nhập lại.");
      }
    }
  };


    return (
        <Layout>
            <div className="admin-wrapper">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Link to={`/admin/document/${id}/question/create`}>
                        <button className="admin-btn edit">+ Thêm câu hỏi</button>
                    </Link>
                </div>

                <h2 className="admin-title">Danh sách câu hỏi</h2>

                <div className="admin-card">
                    <div className="table-scroll-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Chủ đề</th>
                                    <th>Câu hỏi</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.length > 0 ? (
                                    questions.map((question) => (
                                        <tr key={question.id}>
                                            <td>{question.id}</td>
                                            <td>{question.document__title}</td>
                                            <td>{question.content}</td>
                                            <td className="col-action">
                                                <Link to={`/admin/question/${question.id}`}>
                                                    <button className="admin-btn edit">Chi tiết</button>
                                                </Link>
                                                <button
                                                    className="admin-btn delete"
                                                    onClick={() => handleDelete(question.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>
                                            Không có câu hỏi nào!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminQuestion;
