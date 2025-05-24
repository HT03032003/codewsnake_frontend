// Community.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { FaBell } from "react-icons/fa";
import axios from "axios";
import Post from "./Post"; // Import đúng đường dẫn!
import '../styles/community.css';

const Community = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNoti, setShowNoti] = useState(false);
    const navigate = useNavigate();

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error('No token found');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    // Fetch posts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/community/posts/`)
            .then((response) => setPosts(response.data))
            .catch(() => {});
    }, []);

    // Fetch notifications (chỉ khi đăng nhập)
    const fetchNotifications = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/community/notifications/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        }
    };

    useEffect(() => { fetchNotifications(); }, [user]);

    // Số thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Form handlers
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") setImage(files[0]);
        else if (name === "title") setTitle(value);
        else if (name === "content") setContent(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("author", user?.user?.id);
        if (image) formData.append("image", image);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return navigate("/login");
            await axios.post(`${process.env.REACT_APP_API_URL}/community/posts/create/`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            const postsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/community/posts/`);
            setPosts(postsResponse.data);
            setShowForm(false);
            setTitle(''); setContent(''); setImage(null);
        } catch (error) {}
    };

    // Render
    return (
        <div className="community-container">
            <div className="community-left">
                <div className="user-posts-section">
                    <h3>Bài viết của bạn</h3>
                    <div className="community-post-list">
                        {posts.filter(p => p.author === user?.user?.id).map(post => (
                            <Link to={`/post/${post.id}`} key={post.id} className="my-post">
                                <p>{post.content}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="community-right">
                <div className="community-header">
                    {user ? (
                        <div className="user-header">
                            <h2>{user.user.username}</h2>
                            <div style={{ position: "relative" }}>
                                <button className="notification-bell" onClick={() => setShowNoti(v => !v)}>
                                    <FaBell />
                                    <span className="notification-dot"></span>
                                </button>
                                {showNoti && (
                                    <div className="notification-dropdown">
                                        <h4>Thông báo</h4>
                                        <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                                            {notifications.length === 0 ? (
                                                <div className="notification-empty">Không có thông báo mới.</div>
                                            ) : (
                                                notifications.map((noti) => (
                                                    <div key={noti.id} className={`notification-item${!noti.is_read ? ' unread' : ''}`}>
                                                        <Link to={`/post/${noti.post}`} onClick={() => setShowNoti(false)}>
                                                            <b>{noti.sender_name}</b> {noti.notification_type === 'comment' ? 'đã bình luận' : 'đã thích'} bài <b>{noti.post_title}</b>
                                                        </Link>
                                                        <span className="noti-time">{new Date(noti.created_at).toLocaleString()}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button className="btn" onClick={() => {
                                const token = localStorage.getItem("accessToken");
                                if (!token) navigate("/login");
                                else setShowForm(!showForm);
                            }}>+</button>
                        </div>
                    ) : (
                        <h2>Cộng đồng lập trình Python</h2>
                    )}
                </div>

                {showForm && (
                    <div className="community-post-form">
                        <h3>Tạo bài đăng mới</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="title" placeholder="Tiêu đề" value={title} onChange={handleChange} required />
                            <textarea name="content" placeholder="Nội dung" value={content} onChange={handleChange} required />
                            <label htmlFor="image" style={{ textAlign: "left" }}>+ Thêm hình ảnh</label>
                            <input id="image" type="file" name="image" accept="image/*" onChange={handleChange} />
                            {image && (<div className="file-name"><p>{image.name}</p><img src={URL.createObjectURL(image)} alt="Image preview" className="preview-image" /></div>)}
                            <button type="submit" className="btn">Đăng bài</button>
                        </form>
                    </div>
                )}

                {/* Route bài post - truyền setNotifications vào Post để nó update sau khi comment/like */}
                <Routes>
                    <Route path="/post/:id" element={<Post setNotifications={setNotifications} fetchNotifications={fetchNotifications} />} />
                </Routes>

                <div className="community-posts-container">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} to={`/post/${post.id}`}>
                                <div key={post.id} className="community-post-card">
                                    <h3>{post.title}</h3>
                                    <p className="content-post">{post.content}</p>
                                    {post.image ? (<img src={post.image} alt={post.title} />) : ''}
                                </div>
                            </Link>
                        ))
                    ) : (<p>No posts yet.</p>)}
                </div>
            </div>
        </div>
    );
};

export default Community;
