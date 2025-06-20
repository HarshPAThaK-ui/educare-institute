import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="home hero-section">
        <div className="home-content">
          <h1 className="hero-title">Welcome to Educare Institute</h1>
          <p className="hero-subtitle">Empowering Excellence in Offline Education</p>
          <button onClick={()=>navigate("/programs")} className="common-btn hero-btn">View Our Programs</button>
        </div>
        <div className="hero-image-wrapper">
          <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80" alt="Students" className="hero-image" />
        </div>
      </div>
      {/* Decorative Divider */}
      <div className="divider" />
      {/* Testimonials Section */}
      <div className="testimonials-section" style={{ background: '#f8fafc', padding: '40px 0', marginTop: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>What Our Students Say</h2>
        <div className="testimonials-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"The teaching methods at Educare Institute are truly exceptional. I gained so much confidence in my studies!"</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Saksham Jaiswal</div>
          </div>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"Supportive teachers and a great environment for learning. Highly recommend to all students!"</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Shashank Singh</div>
          </div>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"I loved the interactive classes and personal attention from faculty. My results improved a lot."</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Shubhangi Singh</div>
          </div>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"Best institute for academic excellence. The resources and guidance are top-notch."</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Vikas Singh</div>
          </div>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"The friendly atmosphere and expert teachers made learning enjoyable and effective."</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Himanshu Yadav</div>
          </div>
          <div className="testimonial-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, maxWidth: 320, minWidth: 220 }}>
            <p>"I am grateful for the support and motivation I received here. Truly the best!"</p>
            <div style={{ marginTop: 12, fontWeight: 600 }}>- Harshit Pathak</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
