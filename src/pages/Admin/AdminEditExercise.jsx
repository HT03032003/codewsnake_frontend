import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const AdminEditExercise = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [exercise, setExercise] = useState({
        title: "",
        description: "",
        difficulty: "",
        question_text: "",
    });
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
    
        const fetchExercise = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/exercises/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExercise(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài tập:", error);
            }
        };
    
        fetchExercise();
    }, [id, navigate]); // Không cần fetchExercise ở đây nữa
    

    const handleChange = (e) => {
        setExercise({ ...exercise, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/dashboard/exercise/update/${id}/`, exercise, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Cập nhật thành công!");
            navigate("/admin/exercises");
        } catch (error) {
            console.error("Lỗi khi cập nhật bài tập:", error);
        }
    };

    return (
        <Layout>
            <div className="admin">
                <h2 className="admin-title">Chỉnh sửa bài tập</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <label>Tiêu đề:</label>
                    <input type="text" name="title" value={exercise.title} onChange={handleChange} required />

                    <label>Mô tả:</label>
                    <textarea name="description" value={exercise.description} onChange={handleChange} required />

                    <label>Độ khó:</label>
                    <select name="difficulty" value={exercise.difficulty} onChange={handleChange} required>
                        <option value="">-- Chọn mức độ --</option>
                        <option value="Dễ">Dễ</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Khó">Khó</option>
                    </select>

                    <label>Nội dung câu hỏi:</label>
                    <textarea name="question_text" value={exercise.question_text} onChange={handleChange} />

                    <div className="form-actions">
                        <button type="submit" className="btn-save">Lưu</button>
                        <button type="button" className="btn-cancel" onClick={() => navigate("/admin/exercises")}>Hủy</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AdminEditExercise;
