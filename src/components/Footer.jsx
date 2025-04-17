const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section intro">
          <div className="logo">
            <img src={`${process.env.REACT_APP_API_URL}/media/logo/logo.png`} alt="Logo" />
            <span>CodewSnake</span>
          </div>
          <p>CodeLearn là nền tảng tương tác trực tuyến hỗ trợ người dùng học tập, thực hành...</p>
          <div className="social-icons">
            <img width="94" height="94" src="https://img.icons8.com/3d-fluency/94/instagram-logo.png" alt="instagram-logo" />
            <img width="48" height="48" src="https://img.icons8.com/color/48/facebook.png" alt="facebook"/>
            <img width="48" height="48" src="https://img.icons8.com/pulsar-color/48/twitterx.png" alt="twitterx"/>
          </div>
        </div>

        <div className="footer-section">
          <h4>Tính năng</h4>
          <ul>
            <li>Học lý thuyết</li>
            <li>Bài tập</li>
            <li>Coding</li>
            <li>Cộng đồng</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Về chúng tôi</h4>
          <ul>
            <li>Giới thiệu</li>
            <li>Điều khoản sử dụng</li>
            <li>Trợ giúp</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Thông tin liên hệ</h4>
          <ul>
            <li>📍 Tòa ABC, 304/50 Nguyễn Lương Bằng, Hòa Thắng, Buôn Ma Thuột, Đak Lak</li>
            <li>📞 0818326979</li>
            <li>📧 support@codewsnake.io</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
