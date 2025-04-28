import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Bạn cần đăng nhập.');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
                setAvatarPreview(response.data.profile.avatar ? `${response.data.profile.avatar}` : `${process.env.REACT_APP_API_URL}/media/default.png`);
                setLoading(false);
            } catch (err) {
                setError('Không thể lấy thông tin người dùng.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('username', profile.user.username);
        formData.append('address', profile.profile.address);
        formData.append('phone_number', profile.profile.phone_number);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        const token = localStorage.getItem('accessToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/user/profile/update/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/profile');
            window.location.reload();
        } catch (err) {
            setError('Không thể cập nhật thông tin người dùng.');
        }
        setLoading(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="loading-message">Đang tải...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-page">
            <div className="robot-hole-container">
                <img src="/images/3D.png" className="robot-head" alt="Robot Head" />
                <div className="hole-shadow"></div>
            </div>

            <div className="profile-container horizontal-layout">
                {/* Bên trái: Avatar + tên */}
                <div className="profile-left">
                    <div className="avatar-container">
                        <img src={avatarPreview} alt="Avatar" className="avatar" />
                        <label htmlFor="avatar-upload" className="upload-btn">✏️</label>
                        <input
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <h2 className="username">{profile.user.username}</h2>
                    <p className="user-role">Lập trình viên Python</p>
                </div>

                {/* Bên phải: Form chỉnh sửa */}
                <form onSubmit={handleSubmit} className="profile-right">
                    <div className="profile-info">
                        <div className="profile-item">
                            <span className="label">Email:</span>
                            <span className="infor">{profile.user.email}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Địa chỉ:</span>
                            <input
                                type="text"
                                className="edit-profile"
                                value={profile.profile.address}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        profile: {
                                            ...profile.profile,
                                            address: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                        <div className="profile-item">
                            <span className="label">Số điện thoại:</span>
                            <input
                                type="text"
                                className="edit-profile"
                                value={profile.profile.phone_number}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        profile: {
                                            ...profile.profile,
                                            phone_number: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
