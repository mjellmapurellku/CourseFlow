import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">CourseFlow</div>

        <div className="footer-socials">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} CourseFlow. | Learn smarter with AI.
      </div>
    </footer>
  );
};

export default Footer;
