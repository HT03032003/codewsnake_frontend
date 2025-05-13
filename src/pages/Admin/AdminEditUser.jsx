import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import "../../styles/admin/user.css";

const AdminEditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        profile: {
            address: "",
            phone_number: "",
            avatar: null
        },
        is_superuser: false,
    });
    const [exerciseStats, setExerciseStats] = useState({ completed: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios
            .get(`${process.env.REACT_APP_API_URL}/dashboard/users/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUser(response.data.user);
                setExerciseStats(response.data.exercise_stats);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu người dùng.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setUser({
            ...user,
            [name]: checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        axios
            .put(`${process.env.REACT_APP_API_URL}/dashboard/users/update/${id}/`, {
                is_superuser: user.is_superuser,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert("Cập nhật thành công!");
                navigate("/admin/accounts");
            })
            .catch(() => {
                alert("Có lỗi xảy ra khi cập nhật!");
            });
    };

    if (loading) return <p className="loading-text">Đang tải...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <Layout>
            <div className="admin-wrapper">
                <h2 className="admin-title">QUẢN LÝ TÀI KHOẢN</h2>
                <form onSubmit={handleSubmit} className="admin-card">
                    <div className="form-layout">
                        <div className="admin-image-container">
                            {user.profile?.avatar ? (
                                <img
                                    src={user.profile.avatar}
                                    alt="Avatar"
                                    className="avatar"
                                />
                            ) : (
                                <p className="no-avatar-text">Không có ảnh đại diện</p>
                            )}
                        </div>

                        <div className="admin-form-fields">
                            <table className="admin-user-info">
                                <tbody>
                                    <tr>
                                        <td className="label"><label className="form-label">Tên người dùng:</label></td>
                                        <td><input
                                            type="text"
                                            name="username"
                                            className="form-input"
                                            value={user.username}
                                            readOnly
                                        /></td>
                                    </tr>
                                    <tr>
                                        <td className="label"><label className="form-label">Email:</label></td>
                                        <td><input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            value={user.email}
                                            readOnly
                                        /></td>
                                    </tr>
                                    <tr>
                                        <td className="label"><label className="form-label">Địa chỉ:</label></td>
                                        <td><input
                                            type="text"
                                            name="address"
                                            className="form-input"
                                            value={user.profile?.address || ""}
                                            readOnly
                                        /></td>
                                    </tr>
                                    <tr>
                                        <td className="label"><label className="form-label">Số điện thoại:</label></td>
                                        <td><input
                                            type="text"
                                            name="phone_number"
                                            className="form-input"
                                            value={user.profile?.phone_number || ""}
                                            readOnly
                                        /></td>
                                    </tr>
                                    <tr>
                                        <td className="label">
                                            <div className="form-group checkbox-group">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="is_superuser"
                                                        className="checkbox-input"
                                                        checked={user.is_superuser}
                                                        onChange={handleChange}
                                                    />
                                                    Là Admin
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label"><label className="form-label">Tiến độ bài tập:</label></td>
                                        <td>
                                            <div className="progress-bar-wrapper">
                                                <progress value={exerciseStats.completed} max={exerciseStats.total}></progress>
                                                <span>{exerciseStats.completed} / {exerciseStats.total}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="form-actions">
                                <button type="submit" className="admin-btn save">Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AdminEditUser;
