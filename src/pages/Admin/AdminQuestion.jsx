import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const AdminQuestion = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios.get(`${process.env.REACT_APP_API_URL}/dashboard/questions/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setQuestions(res.data);
            })
            .catch(err => {
                console.error("Lỗi khi lấy danh sách câu hỏi:", err);
            });
    }, []);
    const handleDelete = async (postId) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/posts/delete/${postId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // setPosts((prev) => prev.filter((p) => p.id !== postId));
                alert("Xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa bài đăng:", error);
                alert("Không thể xóa! Kiểm tra quyền hoặc đăng nhập lại.");
            }
        }
    };

    return (
        <Layout>
            <div className="admin-wrapper">
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
                                        <td colSpan="8" style={{ textAlign: "center" }}>
                                            Không có bài đăng nào!
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
