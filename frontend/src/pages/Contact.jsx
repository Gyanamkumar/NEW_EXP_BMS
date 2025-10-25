import React, { useEffect } from 'react';
import './Contact.css'; // Keep the page-specific CSS

export default function Contact() {

  // Set the page title
  useEffect(() => {
    document.title = 'Contact Us - VocalLock';
  }, []);

  // The canvas animation useEffect has been REMOVED

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    // Changed to a <div>, canvas and gradient orbs are REMOVED
    <div>
      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1>
            Let's Start a
            <span className="gradient-text">Conversation</span>
          </h1>
          <p>Have questions about VocalLock? Want to explore partnership opportunities? We're here to help you unlock the future of voice authentication.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form">
              <h2>Send Us a Message</h2>
              {/* Use React's onSubmit handler */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* 'for' becomes 'htmlFor' in JSX */}
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required placeholder="Example : John Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required placeholder="Example :john@example.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required placeholder="How can we help?" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required placeholder="Tell us more about your inquiry..."></textarea>
                </div>
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email Us</h3>
                <p>
                  General: <a href="mailto:hello@vocallock.com">hello@vocallock.com</a><br />
                  Support: <a href="mailto:support@vocallock.com">support@vocallock.com</a><br />
                  Sales: <a href="mailto:sales@vocallock.com">sales@vocallock.com</a>
                </p>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Call Us</h3>
                <p>
                  Sales: <a href="tel:+11234567890">+1 (123) 456-7890</a><br />
                  Support: <a href="tel:+10987654321">+1 (098) 765-4321</a><br />
                  Mon-Fri, 9 AM - 6 PM ISD
                </p>
              </div>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Visit Us</h3>
                <p>
                  123 Innovation Drive<br />
                  Bengaluru, KA 560001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h3>Find Us on the Map</h3>
            <div className="map-placeholder">
              <iframe 
                width="100%" 
                height="400" 
                frameBorder="0" 
                style={{ border: 0, borderRadius: '16px' }} 
                src="https://maps.google.com/maps?q=12.913862,77.499388+(VocalLock)&z=15&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="VocalLock Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 VocalLock. Crafted with care and precision.</p>
      </footer>
    </div>
  );
}