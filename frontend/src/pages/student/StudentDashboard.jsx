import React, { useState, useEffect } from 'react';
import './studentDashboard.css';
import { 
  MdDashboard, 
  MdSchool, 
  MdSchedule, 
  MdPerson, 
  MdBook,
  MdNotifications,
  MdCalendarToday,
  MdLocationOn,
  MdAccessTime
} from 'react-icons/md';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedClass, setSelectedClass] = useState('6th');

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const fetchNotes = async (className) => {
    setLoadingNotes(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://educare-institute.onrender.com/api/admin/notes?class=${className}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        setNotes([]);
      }
    } catch (err) {
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notes') fetchNotes(selectedClass);
  }, [activeTab, selectedClass]);

  const fetchSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes?studentClass=${user?.studentClass || ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.classes || []);
      } else {
        setSchedule([]);
      }
    } catch (err) {
      setSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'schedule' && user) fetchSchedule();
  }, [activeTab, user]);

  const renderOverview = () => (
    <div className="overview-section">
      <div className="welcome-card">
        <h2>Welcome back, Student!</h2>
        <p>Here's what's happening with your studies today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">
            <MdSchool />
          </div>
          <div className="stat-content">
            <h3>{loadingUser ? '-' : user && user.enrollment ? user.enrollment.length : 0}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">
            <MdSchedule />
          </div>
          <div className="stat-content">
            <h3>{loadingSchedule || user && user.enrollment && user.enrollment.length === 0 ? 0 : schedule.length}</h3>
            <p>Classes This Week</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyCourses = () => (
    <div className="courses-section">
      <h3>My Enrolled Courses</h3>
      {loadingUser ? (
        <div>Loading courses...</div>
      ) : !user || !user.enrollment || user.enrollment.length === 0 ? (
        <div>No courses assigned yet. Please contact your admin.</div>
      ) : (
        <div className="courses-grid">
          {user.enrollment.map((enrollment, idx) => (
            <div key={enrollment._id || idx} className="course-card">
              <div className="course-header">
                <h4>{enrollment.courseTitle || enrollment.title || enrollment.course?.title || 'Course'}</h4>
                <span className={`status-badge ${enrollment.status}`}>{enrollment.status}</span>
              </div>
              <div className="course-details">
                <div className="detail-item">
                  <strong>Enrolled:</strong> {enrollment.enrolledDate ? new Date(enrollment.enrolledDate).toLocaleDateString() : 'N/A'}
                </div>
                <div className="detail-item">
                  <strong>Fee Paid:</strong> {enrollment.feePaid ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="schedule-section">
      <h3>My Schedule</h3>
      {loadingSchedule ? (
        <div>Loading schedule...</div>
      ) : user && user.enrollment && user.enrollment.length === 0 ? (
        <div>No schedule available. Please contact your admin.</div>
      ) : schedule.length === 0 ? (
        <div>No classes scheduled yet.</div>
      ) : (
        <div className="classes-grid">
          {schedule.map((cls) => (
            <div key={cls.id || cls._id} className="class-card">
              <div className="class-header">
                <h4>{cls.title}</h4>
                <span className="class-time">{cls.time}</span>
              </div>
              <div className="class-details">
                <div className="detail-item">
                  <strong>Batch:</strong> {cls.studentClass}
                </div>
                <div className="detail-item">
                  <strong>Course:</strong> {cls.course?.title || 'N/A'}
                </div>
                <div className="detail-item">
                  <strong>Date:</strong> {cls.date ? new Date(cls.date).toLocaleDateString() : ''}
                </div>
                <div className="detail-item">
                  <strong>Teacher:</strong> {cls.teacher}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNotesTab = () => (
    <div className="notes-section">
      <div className="section-header">
        <h3>Class Notes</h3>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="6th">6th</option>
          <option value="7th">7th</option>
          <option value="8th">8th</option>
          <option value="9th">9th</option>
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </select>
      </div>
      {loadingNotes ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div>No notes available for this class.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={note._id}>
                  <td>{note.title}</td>
                  <td>
                    <a href={`/${note.pdf.replace('\\', '/')}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1><MdDashboard /> Student Dashboard</h1>
        <p>Track your progress and manage your studies</p>
      </div>
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <MdDashboard /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <MdSchool /> My Courses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <MdSchedule /> Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'courses' && renderMyCourses()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'notes' && renderNotesTab()}
      </div>
    </div>
  );
};

export default StudentDashboard;