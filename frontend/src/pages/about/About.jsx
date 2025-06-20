import React from 'react'
import './about.css'
import { FaBullseye, FaEye } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about">
      <div className="about-hero">
        <h1 className="about-title">About Educare Institute</h1>
        <p className="about-tagline">Empowering Students, Inspiring Success</p>
      </div>
      <div className="about-content">
        <div className="about-main">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              Welcome to Educare Institute! We are a premier offline coaching center dedicated to providing quality education through personalized attention and traditional classroom learning. Our mission is to build confident, knowledgeable students by combining proven teaching methodologies with individual care and attention.
            </p>
            <div className="about-highlights">
              <div className="highlight-card">
                <span className="highlight-icon"><FaBullseye /></span>
                <h3>Our Mission</h3>
                <p>To nurture every student's potential through face-to-face learning, small batch sizes, and a supportive environment.</p>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon"><FaEye /></span>
                <h3>Our Vision</h3>
                <p>To be the most trusted institute for academic excellence and holistic development in our community.</p>
              </div>
            </div>
            <div className="about-quote-section">
              <blockquote>
                "Education is the most powerful weapon which you can use to change the world."
              </blockquote>
              <span className="about-quote-author">- Nelson Mandela</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
