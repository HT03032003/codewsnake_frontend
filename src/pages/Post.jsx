import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/post.css';

const Post = () => {
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
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error("Error fetching post:", error);
                setError("Không tìm thấy bài viết.");
            });

        const token = localStorage.getItem('accessToken');
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/vote/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUserVote(response.data.vote_type);
                })
                .catch(error => {
                    console.error("Error fetching vote:", error);
                });
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
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const isAuthor = user?.user?.username === post?.author;

    const handleVote = async (voteType) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/community/post/${id}/vote/`,
                { vote_type: voteType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.message === 'Vote added') {
                setUserVote(voteType);
                window.location.reload();
            } else if (response.data.message === 'Vote removed') {
                setUserVote(null);
                window.location.reload();
            }

            setPost(prevPost => ({
                ...prevPost,
                upvotes: prevPost.upvotes + (voteType === 1 && userVote !== 1 ? 1 : userVote === 1 ? -1 : 0),
                downvotes: prevPost.downvotes + (voteType === -1 && userVote !== -1 ? 1 : userVote === -1 ? -1 : 0),
            }));
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/community/post/${id}/comment/create/`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPost(prevPost => ({
                ...prevPost,
                comments: [...prevPost.comments, response.data]
            }));
            setNewComment('');
            window.location.reload();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
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
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Xóa thất bại.");
        }
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

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
                {post.image && (
                    <img src={`${process.env.REACT_APP_API_URL}${post.image}`} alt={post.title} className="post-image" />
                )}
                <p><strong>Tác giả:</strong> {post.author}</p>

                <div className="vote-buttons">
                    <button onClick={() => handleVote(1)} disabled={userVote === 1} className="vote-btn">👍</button>
                    <button onClick={() => handleVote(-1)} disabled={userVote === -1} className="btn">👎</button>
                </div>

                <p><strong>👍 Upvotes:</strong> {post.upvotes} | <strong>👎 Downvotes:</strong> {post.downvotes}</p>

                <div className="comment-section">
                    <h3>Bình luận</h3>
                    {post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <p><strong>{comment.author__username}:</strong> {comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có bình luận.</p>
                    )}

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