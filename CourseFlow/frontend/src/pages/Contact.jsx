import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import "../styles/Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you</p>
        
        <div className="contact-content">
          {/* <form className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea rows={5} placeholder="Your message"></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form> */}
          
          <div className="contact-info">
            <div className="info-item">
              <FiMail />
              <div>
                <h3>Email</h3>
                <p>support@courseflow.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <FiPhone />
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="info-item">
              <FiMapPin />
              <div>
                <h3>Location</h3>
                <p>Prishtine, Kosove</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
