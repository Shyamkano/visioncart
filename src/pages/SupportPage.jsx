import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Make sure this path is correct
import { useAuth } from './AuthContext'; // To get the logged-in user's info
import './SupportPage.css';
import { HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';

const SupportPage = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-fill form if the user is logged in
  useEffect(() => {
    if (user && profile) {
      setFormData({
        name: profile.full_name || '',
        email: user.email || '',
        message: ''
      });
    }
  }, [user, profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message || !formData.email) {
      alert("Please fill in the email and message fields.");
      return;
    }

    // Convert to a mailto link so it actually opens the user's email client
    const subject = encodeURIComponent(`VisionCart Support Request from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    const mailtoUrl = `mailto:care@visioncart.in?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    setIsSubmitted(true); // Show the success message
  };

  return (
    <div className="support-page-container">
      <div className="support-content-wrapper">
        <div className="support-header">
          <h1><HelpCircle size={36} /> Support & Contact</h1>
        </div>

        <div className="support-content">
          {/* Left Side: Contact Form Card */}
          <div className="contact-form-card">
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ color: '#111827' }}>✅ Thank You!</h2>
                <p style={{ color: '#6b7280', marginTop: '10px' }}>Your email client has been opened. Please send the email to reach our team.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="textarea-field"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="send-message-btn" disabled={loading}>
                  {loading ? 'Opening Email...' : 'Send via Email App'}
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Contact Info Card */}
          <div className="contact-info-card">
            <div className="live-chat-placeholder">
              <span className="status">LIVE CHAT (COMING SOON)</span>
              <MessageSquare size={48} strokeWidth={1.5} style={{ margin: '10px 0' }} />
              <p>Chatbot integration placeholder</p>
            </div>
            <ul className="contact-details-list">
              <li><Phone size={20} /> <span>+91 90000 00000</span></li>
              <li><Mail size={20} /> <span>care@visioncart.in</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;