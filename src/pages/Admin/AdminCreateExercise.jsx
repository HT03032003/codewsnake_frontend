import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import "../../styles/admin/exercise-create.css";

const AdminCreateExercise = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "",
        question_text: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/dashboard/exercise/create/`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Bài tập đã được tạo!");
            navigate("/admin/exercises"); // Quay lại trang danh sách bài tập
        } catch (error) {
            console.error("Lỗi khi tạo bài tập:", error);
            alert("Không thể tạo bài tập. Vui lòng thử lại!");
        }
    };

    return (
        <Layout>
            <div className="admin">
                <h2>Tạo bài tập mới</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <label>Tiêu đề:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                    <label>Mô tả:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />

                    <label>Độ khó:</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleChange} required>
                        <option value="">Chọn độ khó</option>
                        <option value="Dễ">Dễ</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Khó">Khó</option>
                    </select>

                    <label>Câu hỏi:</label>
                    <textarea name="question_text" value={formData.question_text} onChange={handleChange} />

                    <button type="submit" className="btn-save">Tạo bài tập</button>
                </form>
            </div>
        </Layout>
    );
};

export default AdminCreateExercise;
