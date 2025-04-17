import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/document.css";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/document/get_documents/`)
      .then(response => setDocuments(response.data))
      .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h2>Tài liệu Python</h2>
      </div>

      <div className="documents-body">
        <ul className="documents-list">
          {documents.map(doc => (
            <li key={doc.id} className="document-item">
              <Link to={`/document/${doc.slug}`} className="document-link">
                <img src="/images/python-icon.png" alt="icon" className="document-icon" />
                <span>{doc.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Robot AI bên cạnh */}
        <div className="robot-container">
          <img src="/images/ai-bot.png" alt="Robot Assistant" className="robot-img" />
        </div>
      </div>
    </div>
  );
};

export default Documents;
