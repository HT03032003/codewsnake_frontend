import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const AdminExercises = () => {
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchExercises(token);
  }, [navigate]);

  const fetchExercises = (token) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/exercises/get_exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setExercises(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  };

  const handleDelete = async (exerciseId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này không?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/exercises/delete/${exerciseId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
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
        <h2 className="admin-title">QUẢN LÝ BÀI TẬP</h2>

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Link to="/admin/exercise/create">
            <button className="admin-btn edit">Thêm bài tập</button>
          </Link>
        </div>

        <div className="admin-card">
          <div className="table-scroll-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Độ khó</th>
                  <th>Câu hỏi</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {exercises.length > 0 ? (
                  exercises.map((ex) => (
                    <tr key={ex.id}>
                      <td>{ex.id}</td>
                      <td>{ex.title}</td>
                      <td>{ex.description}</td>
                      <td>{ex.difficulty}</td>
                      <td>{ex.question_text}</td>
                      <td className="col-action">
                        <Link to={`/admin/exercise/edit/${ex.id}`}>
                          <button className="admin-btn edit">Sửa</button>
                        </Link>
                        <button
                          className="admin-btn delete"
                          onClick={() => handleDelete(ex.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Không có bài tập nào!
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

export default AdminExercises;
