import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/editPost.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/community/post/${id}/`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setImage(response.data.image);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Không thể tải bài viết.");
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("No token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (typeof image !== "string" && image) {
                formData.append("image", image);
            }

            await axios.put(
                `${process.env.REACT_APP_API_URL}/dashboard/post/update/${id}/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Cập nhật thành công!");
            navigate(`/post/${id}`);
        } catch (err) {
            console.error("Update failed:", err);
            setError("Không thể cập nhật bài viết.");
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setImage(files[0]);
        } else if (name === "title") {
            setTitle(value);
        } else if (name === "content") {
            setContent(value);
        }
    };

    if (error) return <p className="error">{error}</p>;

    return (
        <div className="home-container">
            <div className="post-detail-container">
                <h2>Chỉnh sửa bài viết</h2>
                <form onSubmit={handleUpdate} className="edit-post-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Tiêu đề"
                        value={title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="content"
                        placeholder="Nội dung"
                        value={content}
                        onChange={handleChange}
                        rows={8}
                        required
                    />

                    <label htmlFor="image">+ Thêm hình ảnh</label>
                    <input
                        id="image"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />


                    {image && (
                        <div className="file-name">
                            {typeof image === "string" ? (
                                <>
                                    <p>Ảnh hiện tại:</p>
                                    <img
                                        src={`${image}`}
                                        alt="Current"
                                        className="preview-image-post"
                                    />
                                </>
                            ) : (
                                <>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="New preview"
                                        className="preview-image-post"
                                    />
                                </>
                            )}
                        </div>
                    )}

                    <button type="submit">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;