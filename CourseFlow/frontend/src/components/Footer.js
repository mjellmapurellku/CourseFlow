import { FiFacebook, FiGithub, FiInstagram, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">CourseFlow</span>
            </div>
            <p className="footer-description">
              Empowering learners worldwide with AI-powered course recommendations
              and personalized learning experiences.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="#" aria-label="GitHub">
                <FiGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3>Categories</h3>
            <ul className="footer-links">
              <li><a href="#">Programming</a></li>
              <li><a href="#">Design</a></li>
              <li><a href="#">Business</a></li>
              <li><a href="#">Marketing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Stay Updated</h3>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest courses and updates.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">
                <FiMail />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CourseFlow. All rights reserved.</p>
          <p>Made with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
