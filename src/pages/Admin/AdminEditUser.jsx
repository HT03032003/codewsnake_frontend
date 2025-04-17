import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const AdminEditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        address: "",
        phone_number: "",
        is_superuser: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios
            .get(`${process.env.REACT_APP_API_URL}/dashboard/users/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu người dùng.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        axios
            .put(`${process.env.REACT_APP_API_URL}/dashboard/users/update/${id}/`, user, {
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
                                    src={`${process.env.REACT_APP_API_URL}${user.profile.avatar}`}
                                    alt="Avatar"
                                    className="avatar"
                                />
                            ) : (
                                <p className="no-avatar-text">Không có ảnh đại diện</p>
                            )}
                        </div>

                        <div className="admin-form-fields">
                            <table>
                                <tr>
                                    <td><label className="form-label">Tên người dùng:</label></td>
                                    <td><input
                                        type="text"
                                        name="username"
                                        className="form-input"
                                        value={user.username}
                                        onChange={handleChange}
                                        required
                                    /></td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">Email:</label></td>
                                    <td><input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                    /></td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">Địa chỉ:</label></td>
                                    <td><input
                                        type="text"
                                        name="address"
                                        className="form-input"
                                        value={user.profile?.address || ""}
                                        onChange={handleChange}
                                    /></td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">Số điện thoại:</label></td>
                                    <td><input
                                        type="text"
                                        name="phone_number"
                                        className="form-input"
                                        value={user.profile?.phone_number || ""}
                                        onChange={handleChange}
                                    /></td>
                                </tr>
                                <tr>
                                    <td className="checkbox-cell">
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
