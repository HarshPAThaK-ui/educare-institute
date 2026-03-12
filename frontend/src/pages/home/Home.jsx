import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./home.css";

// Testimonials data
const testimonials = [
  {
    quote: "The teaching methods at Educare Institute are truly exceptional. I gained so much confidence in my studies!",
    author: "Saksham Jaiswal"
  },
  {
    quote: "Supportive teachers and a great environment for learning. Highly recommend to all students!",
    author: "Shashank Singh"
  },
  {
    quote: "I loved the interactive classes and personal attention from faculty. My results improved a lot.",
    author: "Shubhangi Singh"
  },
  {
    quote: "Best institute for academic excellence. The resources and guidance are top-notch.",
    author: "Vikas Singh"
  },
  {
    quote: "The friendly atmosphere and expert teachers made learning enjoyable and effective.",
    author: "Himanshu Yadav"
  },
  {
    quote: "I am grateful for the support and motivation I received here. Truly the best!",
    author: "Harshit Pathak"
  }
];

// Testimonial Card Component
const TestimonialCard = ({ quote, author }) => (
  <div className="testimonial-card">
    <p className="testimonial-quote">{quote}</p>
    <div className="testimonial-author">- {author}</div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home hero-section" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <motion.div
          className="home-content"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span className="hero-kicker">Community-first academic coaching</span>
          <h1 id="hero-title" className="hero-title">Welcome to Educare Institute</h1>
          <p className="hero-subtitle">
            Focused classroom learning with expert mentors, structured programs, and real academic outcomes.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => navigate("/register")}
              className="common-btn hero-btn hero-btn-primary"
              aria-label="Start learning with Educare Institute"
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="common-btn hero-btn hero-btn-secondary"
              aria-label="Explore available courses"
            >
              Explore Courses
            </button>
          </div>
          <div className="hero-highlights" aria-label="Educare strengths">
            <span>Small batches</span>
            <span>Experienced mentors</span>
            <span>Practical study plans</span>
          </div>
        </motion.div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" />

      {/* Testimonials Section */}
      <section className="testimonials-section" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="testimonials-heading">
          What Our Students Say
        </h2>
        <div className="testimonials-list">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
