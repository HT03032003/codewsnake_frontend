import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import "../../styles/admin/post-detail.css";

const AdminDetailPost = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetchPostDetails(token);
    }, [navigate, id]);

    const fetchPostDetails = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/post/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPost(response.data);
            setComments(response.data.comments); // Lưu danh sách bình luận
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài đăng:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/comments/${commentId}/delete/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
                alert("Xóa bình luận thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa bình luận:", error);
                alert("Không thể xóa bình luận! Kiểm tra quyền hoặc đăng nhập lại.");
            }
        }
    };

    if (!post) return <p>Đang tải...</p>;

    return (
        <Layout>
            <div className="admin-detail">
                <h2>Chi tiết bài đăng</h2>
                <div className="post-info">
                    <h3>{post.title}</h3>
                    <p><strong>Người đăng:</strong> {post.author}</p>
                    <p><strong>Nội dung:</strong> {post.content}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(post.created_at).toLocaleString()}</p>
                    <p><strong>Ngày cập nhật:</strong> {new Date(post.updated_at).toLocaleString()}</p>
                    <p><strong>👍 {post.upvotes} | 👎 {post.downvotes}</strong></p>
                </div>

                <h3>Bình luận ({comments.length})</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Người bình luận</th>
                            <th>Nội dung</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <tr key={comment.id}>
                                    <td>{comment.author}</td>
                                    <td>{comment.content}</td>
                                    <td>{new Date(comment.created_at).toLocaleString()}</td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDeleteComment(comment.id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>Không có bình luận nào!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminDetailPost;
