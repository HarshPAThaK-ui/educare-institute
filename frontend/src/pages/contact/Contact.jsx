import React, { useState } from 'react';
import './contact.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../../main';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentClass: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${server}/api/contact/submit`, formData);
      toast.success(response.data.message);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        studentClass: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for admissions and inquiries</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h3>Visit Our Center</h3>
            <div className="info-item">
              <strong>Address:</strong>
              <p>4/119, Vibhav Khand -4, Vibhav Khand<br />
              Gomti Nagar, Lucknow, Uttar Pradesh 226010</p>
            </div>
            <div className="info-item">
              <strong>Landmark:</strong>
              <p>Mantri Aawas</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Contact Details</h3>
            <div className="info-item">
              <strong>Phone:</strong>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-item">
              <strong>WhatsApp:</strong>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <p>info@educareinstitute.com</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Office Hours</h3>
            <div className="info-item">
              <strong>Monday - Friday:</strong>
              <p>8:00 AM - 8:00 PM</p>
            </div>
            <div className="info-item">
              <strong>Saturday:</strong>
              <p>8:00 AM - 6:00 PM</p>
            </div>
            <div className="info-item">
              <strong>Sunday:</strong>
              <p>10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send us a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentClass">Student's Class</label>
              <select 
                id="studentClass" 
                name="studentClass"
                value={formData.studentClass}
                onChange={handleInputChange}
              >
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="jee">JEE Preparation</option>
                <option value="neet">NEET Preparation</option>
                <option value="english">English Speaking</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                placeholder="Tell us about your requirements..."
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="location-section">
        <h2>How to Reach Us</h2>
        <div className="directions">
          <div className="direction-item">
            <h4>By Bus</h4>
            <p>Take any bus going towards Gomti Nagar and get down at Vibhav Khand stop. Walk 2-3 minutes towards Mantri Aawas.</p>
          </div>
          <div className="direction-item">
            <h4>By Auto/Cab</h4>
            <p>Tell the driver to go to Vibhav Khand - 4, near Mantri Aawas in Gomti Nagar. We are located at 4/119.</p>
          </div>
          <div className="direction-item">
            <h4>By Car</h4>
            <p>Navigate to Vibhav Khand - 4, Gomti Nagar. Look for Mantri Aawas landmark. We are located at 4/119, Vibhav Khand.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 