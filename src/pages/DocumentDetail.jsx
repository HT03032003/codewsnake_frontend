import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for navigation
import axios from "axios";
import parse from "html-react-parser"; // Thư viện để hiển thị HTML
import '../styles/documentDetail.css';

const DocumentDetail = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const [document, setDocument] = useState(null);

    useEffect(() => {
        console.log(slug);

        axios.get(`${process.env.REACT_APP_API_URL}/document/${slug}/`)
            .then(response => {
                setDocument(response.data);
                console.log(response.data);
            })
            .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
    }, [slug]);

    if (!document) return <p className="loading">Đang tải...</p>;

    return (
        <div className="document-detail-container">

            <div className="document-header">
                <h2 className="document-title">{document.title}</h2>
            </div>

            <article className="document-content">
                <img src="/images/robot-hand.png" alt="Robot Hand" className="robot-hand-outside robot-hand-outside-left" />
                <img src="/images/robot-hand.png" alt="Robot Hand" className="robot-hand-outside robot-hand-outside-right" />
                <section className="content">
                    {parse(document.content)}
                </section>
            </article>

            <div className="quiz-button-container">
                <Link to={`/quiz/${document.slug}`}>
                    <button className="quiz-start-button">Làm Quiz</button>
                </Link>
            </div>
        </div>

    );
};

export default DocumentDetail;