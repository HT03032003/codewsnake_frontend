import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchPosts(token);
  }, [navigate]);

  const fetchPosts = (token) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/dashboard/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/post/delete/${postId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts((prev) => prev.filter((p) => p.id !== postId));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa bài đăng:", error);
        alert("Không thể xóa! Kiểm tra quyền hoặc đăng nhập lại.");
      }
    }
  };

  return (
    <Layout>
      <div className="admin-wrapper">
        <h2 className="admin-title">QUẢN LÝ BÀI ĐĂNG</h2>

        <div className="admin-card">
          <div className="table-scroll-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Nội dung</th>
                  <th>Tổng lượt thích</th>
                  <th>Tổng không thích</th>
                  <th>Số bình luận</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.author}</td>
                      <td>{post.content}</td>
                      <td style={{ textAlign: "center" }}>{post.upvotes}</td>
                      <td style={{ textAlign: "center" }}>{post.downvotes}</td>
                      <td style={{ textAlign: "center" }}>{post.comment_count}</td>
                      <td className="col-action">
                        <Link to={`/admin/post/${post.id}`}>
                          <button className="admin-btn edit">Chi tiết</button>
                        </Link>
                        <button
                          className="admin-btn delete"
                          onClick={() => handleDelete(post.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      Không có bài đăng nào!
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

export default AdminPosts;
