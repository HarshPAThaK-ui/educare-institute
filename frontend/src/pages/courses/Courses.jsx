import React, { useState, useEffect } from 'react';
import './courses.css';
import EnquiryModal from '../../components/EnquiryModal';

const Courses = () => {
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Class 9-10 Foundation Program",
      description: "Comprehensive coaching for CBSE/ICSE students with focus on Mathematics, Science, and English. Small batch sizes for personalized attention.",
      duration: "12 months",
      schedule: "Monday to Friday, 4:00 PM - 6:00 PM",
      batchSize: "15 students max",
      subjects: ["Mathematics", "Science", "English"],
      fee: "₹8,000/month"
    },
    {
      id: 2,
      title: "Class 11-12 Science Stream",
      description: "Specialized coaching for PCM/PCB students preparing for competitive exams. Includes regular tests and doubt sessions.",
      duration: "24 months",
      schedule: "Monday to Saturday, 6:00 PM - 8:00 PM",
      batchSize: "12 students max",
      subjects: ["Physics", "Chemistry", "Mathematics/Biology"],
      fee: "₹12,000/month"
    },
    {
      id: 3,
      title: "JEE/NEET Preparation",
      description: "Intensive coaching for engineering and medical entrance exams. Includes mock tests, study material, and personal mentoring.",
      duration: "18 months",
      schedule: "Monday to Sunday, 8:00 AM - 12:00 PM",
      batchSize: "10 students max",
      subjects: ["Physics", "Chemistry", "Mathematics/Biology"],
      fee: "₹15,000/month"
    },
    {
      id: 4,
      title: "English Speaking & Communication",
      description: "Improve your English speaking skills through interactive sessions, group discussions, and practical exercises.",
      duration: "6 months",
      schedule: "Weekends, 10:00 AM - 12:00 PM",
      batchSize: "20 students max",
      subjects: ["Spoken English", "Grammar", "Communication Skills"],
      fee: "₹5,000/month"
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleEnquireClick = (program) => {
    console.log('Enquire Now clicked for:', program);
    setSelectedProgram(program);
    setModalOpen(true);
    console.log('Modal should be open:', true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProgram(null);
  };

  const handleEnquirySubmit = async (formData) => {
    // Send to backend to trigger email
    const response = await fetch("/api/contact/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        studentClass: formData.program, // Use program as studentClass
        message: formData.message,
      }),
    });
    if (!response.ok) throw new Error("Failed to send enquiry");
    return response.json();
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Our Coaching Programs</h1>
        <p>Choose from our wide range of offline coaching programs designed for your success</p>
      </div>
      
      <div className="courses-grid">
        {programs.map((program) => (
          <div key={program.id} className="course-card">
            <div className="course-content">
              <h3>{program.title}</h3>
              <p className="description">{program.description}</p>
              
              <div className="course-details">
                <div className="detail-item">
                  <strong>Duration:</strong> {program.duration}
                </div>
                <div className="detail-item">
                  <strong>Schedule:</strong> {program.schedule}
                </div>
                <div className="detail-item">
                  <strong>Batch Size:</strong> {program.batchSize}
                </div>
                <div className="detail-item">
                  <strong>Subjects:</strong> {program.subjects.join(", ")}
                </div>
                <div className="detail-item fee">
                  <strong>Fee:</strong> {program.fee}
                </div>
              </div>
              
              <button className="enroll-btn" onClick={() => handleEnquireClick(program.title)}>Enquire Now</button>
            </div>
          </div>
        ))}
      </div>
      <EnquiryModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleEnquirySubmit}
        programTitle={selectedProgram}
      />
      <div className="coaching-features">
        <h2>Why Choose Our Offline Coaching?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Personal Attention</h3>
            <p>Small batch sizes ensure every student gets individual attention from teachers.</p>
          </div>
          <div className="feature">
            <h3>Experienced Faculty</h3>
            <p>Learn from qualified and experienced teachers with proven track records.</p>
          </div>
          <div className="feature">
            <h3>Regular Assessments</h3>
            <p>Weekly tests and monthly assessments to track your progress.</p>
          </div>
          <div className="feature">
            <h3>Doubt Sessions</h3>
            <p>Dedicated time for clearing doubts and one-on-one mentoring.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 