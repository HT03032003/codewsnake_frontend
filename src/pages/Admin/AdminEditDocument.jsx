import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";  // Import Quill
import "react-quill/dist/quill.snow.css";  // Import CSS của Quill
import Layout from "./Layout";

const AdminEditDocument = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Lưu HTML
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        axios
            .get(`${process.env.REACT_APP_API_URL}/dashboard/document/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTitle(response.data.title);
                setContent(response.data.content); // Giữ nguyên HTML
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu tài liệu.");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/dashboard/document/update/${id}/`,
                { title, content }, // Lưu HTML đúng định dạng
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Cập nhật thành công!");
            navigate("/admin/documents");
        } catch (error) {
            console.error("Lỗi cập nhật tài liệu:", error);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    };

    if (loading) return <p className="loading-text">Đang tải...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <Layout>
            <div className="edit-document-container">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Link to="/admin/questions">
                        <button className="admin-btn edit">Danh sách câu hỏi</button>
                    </Link>
                </div>
                <h2 className="admin-title">Chỉnh sửa tài liệu</h2>
                <form onSubmit={handleSubmit} className="edit-document-form">
                    {/* Ô nhập tiêu đề */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Tiêu đề:
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="form-input title-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Nhập tiêu đề tài liệu"
                        />
                    </div>

                    {/* Trình soạn thảo HTML thay cho textarea */}
                    <div className="form-group">
                        <label className="form-label">Nội dung:</label>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            theme="snow"
                            style={{color: "black"}}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-save">
                            Lưu thay đổi
                        </button>
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => navigate("/admin/documents")}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AdminEditDocument;
