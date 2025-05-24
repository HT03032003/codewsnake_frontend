import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentThread from "../components/CommentThread";
import "../styles/post.css";

const Post = ({ setNotifications, fetchNotifications }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [userVote, setUserVote] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/`)
            .then(response => setPost(response.data))
            .catch(() => setError("Không tìm thấy bài viết."));
        const token = localStorage.getItem('accessToken');
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/vote/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setUserVote(response.data.vote_type))
                .catch(() => {});
        }
    }, [id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error('No token found');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const isAuthor = user?.user?.username === post?.author;

    // Vote
    const handleVote = async (voteType) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/community/post/${id}/vote/`,
                { vote_type: voteType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.message === 'Vote added' || response.data.message === 'Vote updated') {
                setUserVote(voteType);
            } else if (response.data.message === 'Vote removed') {
                setUserVote(null);
            }
            const postRes = await axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/`);
            setPost(postRes.data);

            // CẬP NHẬT THÔNG BÁO
            if (typeof fetchNotifications === 'function') fetchNotifications();
        } catch (error) {}
    };

    // Comment (và reply)
    const handleAddComment = async (content, parentId = null) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');
            const data = { content };
            if (parentId) data.parent = parentId;
            await axios.post(
                `${process.env.REACT_APP_API_URL}/community/post/${id}/comment/create/`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const postRes = await axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/`);
            setPost(postRes.data);

            // CẬP NHẬT THÔNG BÁO
            if (typeof fetchNotifications === 'function') fetchNotifications();
        } catch (error) {}
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        handleAddComment(newComment);
        setNewComment('');
    };

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("No token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/post/delete/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Bài viết đã được xóa.");
            navigate("/community");
        } catch {
            alert("Xóa thất bại.");
        }
    };

    const toggleMenu = () => setShowMenu(!showMenu);

    if (error) return <p className="error">{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="home-container">
            <div className="post-detail-container">
                <div className="post-header">
                    <h2>{post.title}</h2>
                    {isAuthor && (
                        <div className="post-menu-container">
                            <button className="menu-toggle-btn" onClick={toggleMenu}>⋯</button>
                            {showMenu && (
                                <div className="dropdown-menu">
                                    <button onClick={() => navigate(`/post/edit/${id}`)}>✏️ Chỉnh sửa</button>
                                    <button onClick={handleDeletePost}>🗑️ Xóa bài</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <p className="content">{post.content}</p>
                {post.image && (<img src={`${post.image}`} alt={post.title} className="post-image" />)}
                <p><strong>Tác giả:</strong> {post.author}</p>
                <div className="vote-buttons">
                    <button onClick={() => handleVote(1)} disabled={userVote === 1} className="vote-btn">👍</button>
                    <button onClick={() => handleVote(-1)} disabled={userVote === -1} className="btn">👎</button>
                </div>
                <p><strong>👍 Upvotes:</strong> {post.upvotes} | <strong>👎 Downvotes:</strong> {post.downvotes}</p>
                <div className="comment-section">
                    <h3>Bình luận</h3>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <CommentThread
                                key={comment.id}
                                comment={comment}
                                onReply={(parentId, content) => handleAddComment(content, parentId)}
                            />
                        ))
                    ) : (<p>Chưa có bình luận.</p>)}
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                        />
                        <button type="submit">Gửi</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Post;
