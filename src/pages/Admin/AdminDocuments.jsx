import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetchDocuments(token);
    }, [navigate]);

    const fetchDocuments = (token) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/document/get_documents/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setDocuments(res.data))
            .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
    };

    const deleteDocument = (id) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
            axios
                .delete(`${process.env.REACT_APP_API_URL}/document/delete/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
                    alert("Xóa thành công!");
                })
                .catch((err) => {
                    console.error("Lỗi khi xóa tài liệu:", err);
                    alert("Không thể xóa! Kiểm tra quyền hoặc đăng nhập lại.");
                });
        }
    };

    return (
        <Layout>
            <div className="admin-wrapper">
                <h2 className="admin-title">QUẢN LÝ TÀI LIỆU</h2>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Link to="/admin/document/create">
                        <button className="admin-btn edit">Thêm tài liệu</button>
                    </Link>
                </div>

                <div className="admin-card">
                    <div className="table-scroll-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên tài liệu</th>
                                    <th>Nội dung</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>{doc.id}</td>
                                            <td>{doc.title}</td>
                                            <td>{doc.content?.substring(0, 50)}...</td>
                                            <td className="col-action">
                                                <Link to={`/admin/document/edit/${doc.id}`}>
                                                    <button className="admin-btn edit">Sửa</button>
                                                </Link>
                                                <button
                                                    className="admin-btn delete"
                                                    onClick={() => deleteDocument(doc.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>
                                            Không có tài liệu nào!
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

export default AdminDocuments;
