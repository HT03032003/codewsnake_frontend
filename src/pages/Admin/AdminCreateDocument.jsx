import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Layout from "./Layout";
import "../../styles/admin/document-create.css";

const AdminCreateDocument = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Vui lòng nhập tiêu đề và nội dung!");
            return;
        }

        const token = localStorage.getItem("accessToken");

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/document/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/admin/documents");
            } else {
                alert("Lỗi khi lưu tài liệu!");
            }
        } catch (error) {
            alert("Lỗi kết nối đến server!");
        }

        setLoading(false);
    };

    return (
        <Layout>
            <div className="create-document-container">
                <h2 className="admin-title">Soạn tài liệu</h2>

                <input
                    type="text"
                    placeholder="Nhập tiêu đề tài liệu..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="title-input"
                />

                <ReactQuill
                    value={content}
                    onChange={setContent}
                    className="content-editor"
                    placeholder="Nhập nội dung tài liệu..."
                />

                <button onClick={handleSave} className="btn-save" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu tài liệu"}
                </button>

            </div>
        </Layout>
    );
};

export default AdminCreateDocument;
