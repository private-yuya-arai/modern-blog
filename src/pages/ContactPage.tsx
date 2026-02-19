
import React from 'react';
import './PageStyles.css'; // Common styles

const ContactPage: React.FC = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">Contact Us</h1>
            <div className="page-content">
                <p>Have questions, suggestions, or just want to say hi? We'd love to hear from you.</p>

                <div className="contact-info">
                    <p><strong>Email:</strong> arai@blog.com</p>
                    <p><strong>Twitter:</strong> @modernblog_ds</p>
                    <p><strong>GitHub:</strong> github.com/modernblog</p>
                </div>

                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows={5} placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="submit-btn" onClick={() => alert('This is a demo form.')}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
