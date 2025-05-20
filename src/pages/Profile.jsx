import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/profile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate("/login");
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể lấy thông tin người dùng.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="loading-message">Đang tải...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-page">
            {/* Robot head tách biệt avatar */}
            <div className="robot-hole-container">
                <img src="/images/3D.png" className="robot-head" alt="Robot Head" />
                <div className="hole-shadow"></div>
            </div>

            <div className="profile-container horizontal-layout">
                {/* Cột trái: Avatar + tên */}
                <div className="profile-left">
                    <div className="avatar-container">
                        {profile.profile.avatar ? (
                            <img
                                src={`${profile.profile.avatar}`}
                                alt="Avatar"
                                className="avatar"
                            />
                        ) : (
                            <div className="avatar-placeholder">?</div>
                        )}
                    </div>
                    <h2 className="username">{profile.user.username}</h2>
                    <p className="user-role">Lập trình viên Python</p>
                </div>

                {/* Cột phải: Thông tin */}
                <div className="profile-right">
                    <div className="profile-info">
                        <div className="profile-item">
                            <span className="label">Email:</span>
                            <span className="infor">{profile.user.email}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Địa chỉ:</span>
                            <span className="infor">{profile.profile.address || 'Chưa có thông tin'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Số điện thoại:</span>
                            <span className="infor">{profile.profile.phone_number || 'Chưa có thông tin'}</span>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-box">
                            <h3>{profile.completed}</h3>
                            <p>Bài tập đã hoàn thành</p>
                        </div>
                        <div className="stat-box">
                            <h3>{profile.profile.points} XP</h3>
                            <p>Điểm đạt được</p>
                        </div>
                        <div className="stat-box">
                            <h3>{profile.incompleted}</h3>
                            <p>Bài tập đang làm</p>
                        </div>
                    </div>
                    <a href="/profile/edit"><button className="btn">Sửa thông tin</button></a>
                    <a href="/progress"><button className="btn">Xem tiến trình</button></a>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
