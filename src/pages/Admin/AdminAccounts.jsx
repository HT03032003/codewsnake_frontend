import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const AdminAccounts = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${process.env.REACT_APP_API_URL}/dashboard/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Lỗi:", err));
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Bạn chưa đăng nhập!");
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/users/delete/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Xóa thành công!");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Xóa lỗi:", err);
      alert("Không thể xóa!");
    }
  };

  return (
    <Layout>
      <div className="admin-wrapper">
        <h2 className="admin-title">QUẢN LÝ TÀI KHOẢN</h2>
        <div className="admin-card">
          <div className="table-scroll-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Điện thoại</th>
                  <th>Quyền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {user.profile?.avatar ? (
                        <img src={user.profile.avatar} className="admin-avatar" />
                      ) : (
                        "Không có"
                      )}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.profile?.address || "Không có"}</td>
                    <td>{user.profile?.phone_number || "Không có"}</td>
                    <td>{user.is_superuser ? "Admin" : "User"}</td>
                    <td className="col-action">
                      {user.email !== "admin@gmail.com" && (
                        <>
                          <Link to={`/admin/edit-user/${user.id}`}>
                            <button className="admin-btn edit">Sửa</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="admin-btn delete"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAccounts;
