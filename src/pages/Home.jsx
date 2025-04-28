import { Link } from "react-router-dom";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <div className="home-wrapper" >
      <section className="intro-banner">
        <h1>Học Python Từ Cơ Bản Đến Nâng Cao 🐍</h1>
        <p>Thực hành trực tiếp, bài tập kèm giải thích, cộng đồng hỗ trợ, hoàn toàn miễn phí.</p>
      </section>

      <section className="feature-grid">
        <Link to="/code-editor" className="feature-card">
          <h2>🔥 Chạy Code</h2>
          <p>Trình thông dịch Python trực tiếp trên trình duyệt.</p>
        </Link>

        <Link to="/document" className="feature-card">
          <h2>📚 Tài Liệu</h2>
          <p>Kiến thức căn bản & nâng cao, giải thích dễ hiểu.</p>
        </Link>

        <Link to="/exercise" className="feature-card">
          <h2>🧠 Bài Tập</h2>
          <p>Hệ thống bài tập từ dễ đến khó kèm đáp án.</p>
        </Link>

        <Link to="/community" className="feature-card">
          <h2>👥 Cộng Đồng</h2>
          <p>Hỏi đáp, chia sẻ kinh nghiệm học lập trình.</p>
        </Link>
      </section>

      <section className="cta-section">
        <Link to="/register" className="cta-button">Bắt đầu học ngay</Link>
      </section>
      <div className="feature-background-wrapper">
        <section className="feature-section reverse" data-aos="fade-up">
          <div className="feature-text">
            <p className="tagline">Tài Liệu</p>
            <h2>Hiểu rõ Python từ gốc</h2>
            <p>
              Học lý thuyết một cách trực quan và đơn giản – được viết riêng cho người mới, có ví dụ minh họa dễ hiểu. Cung cấp các câu hỏi trắc nghiệm để kiểm tra độ hiểu bài của người học.
            </p>
            <Link to="/document" className="btn">Xem tài liệu</Link>
          </div>
          <div className="feature-image">
            <img src="/images/docs3d.png" alt="Docs" />
          </div>
        </section>

        <section className="feature-section" data-aos="fade-up" data-aos-duration="500">
          <div className="feature-text">
            <p className="tagline">Bài tập</p>
            <h2>Học Python thông qua các bài tập</h2>
            <p className="tagline">Bài tập</p>
            <p>
              Đọc, hiểu, trả lời các câu hỏi Python với ba mức độ: Dễ, Trung Bình, Khó. Kiểm tra câu trả lời đúng hay sai.
            </p>
            <Link to="/exercise" className="btn">Làm bài tập</Link>
          </div>
          <div className="feature-image">
            <img src="/images/code3d.png" alt="Run Code" />
          </div>
        </section>

        <section className="feature-section reverse" data-aos="fade-up" data-aos-duration="800">
          <div className="feature-text">
            <p className="tagline">Thực hành</p>
            <h2>Thực hành code của bản thân</h2>
            <p>
              Viết, chạy và kiểm tra mã Python trên trình duyệt với giao diện thân thiện và hiệu ứng nổi bật như hacker! Cho phép upload code từ file, tích hợp chatgpt hỗ trợ sửa code cho người học.
            </p>
            <Link to="/code-editor" className="btn">Vào coding</Link>
          </div>
          <div className="feature-image">
            <img src="/images/practice.png" alt="Docs" />
          </div>
        </section>

        <section className="feature-section" data-aos="fade-up" data-aos-duration="800">
          <div className="feature-text">
            <p className="tagline">Cộng đồng</p>
            <h2>Cộng đồng thân thiện, hỗ trợ lẫn nhau</h2>
            <p>
              Cộng đồng vui vẻ thân thiện, nơi giao lưu gặp gỡ và kết bạn. Tham gia cộng đồng để giúp đỡ nhau cải thiện các kĩ năng về code.
            </p>
            <Link to="/community" className="btn">Vào cộng đồng</Link>
          </div>
          <div className="feature-image">
            <img src="/images/community.png" alt="Run Code" />
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;
