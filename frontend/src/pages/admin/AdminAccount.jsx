import React, { useState } from "react";
import "./adminAccount.css";
import { MdDashboard, MdSchool, MdPeople, MdSchedule, MdSettings, MdPerson, MdEmail, MdPhone, MdLocationOn, MdEdit, MdSecurity } from "react-icons/md";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";

const AdminAccount = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { logoutUser } = UserData();

  const renderProfile = () => (
    <div className="profile-section">
      <h3><MdPerson /> Admin Profile</h3>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <MdPerson />
          </div>
          <div className="profile-info">
            <h4>{user?.name || 'Admin Name'}</h4>
            <p>{user?.email || 'admin@educare.com'}</p>
            <span className="role-badge admin">Administrator</span>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            <p>{user?.name || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Email Address</label>
            <p>{user?.email || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Phone Number</label>
            <p>{user?.phone || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Address</label>
            <p>{user?.address || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Role</label>
            <p>Administrator</p>
          </div>
          <div className="detail-group">
            <label>Access Level</label>
            <p>Full System Access</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn">
            <MdEdit /> Edit Profile
          </button>
          <button className="change-password-btn">
            <MdSecurity /> Change Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemOverview = () => (
    <div className="system-overview">
      <h3><MdDashboard /> System Overview</h3>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-icon">
            <MdPeople />
          </div>
          <div className="overview-content">
            <h4>Student Management</h4>
            <p>Manage student registrations, profiles, and enrollments</p>
            <button className="overview-btn" onClick={() => window.location.href = '/admin?tab=students'}>
              Manage Students
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdSchool />
          </div>
          <div className="overview-content">
            <h4>Course Management</h4>
            <p>Create and manage courses, programs, and curriculum</p>
            <button className="overview-btn" onClick={() => window.location.href = '/admin?tab=courses'}>
              Manage Courses
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdSchedule />
          </div>
          <div className="overview-content">
            <h4>Class Scheduling</h4>
            <p>Schedule classes, manage timetables, and assignments</p>
            <button className="overview-btn" onClick={() => window.location.href = '/admin?tab=classes'}>
              Manage Classes
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <MdSettings />
          </div>
          <div className="overview-content">
            <h4>System Settings</h4>
            <p>Configure system settings and administrative preferences</p>
            <button className="overview-btn" onClick={() => window.location.href = '/admin?tab=settings'}>
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="quick-actions-section">
      <h3><MdDashboard /> Quick Actions</h3>
      <div className="actions-grid">
        <div className="action-card">
          <div className="action-icon">
            <MdPeople />
          </div>
          <h4>Add New Student</h4>
          <p>Register a new student in the system</p>
          <button className="action-btn primary" onClick={() => window.location.href = '/admin?tab=students'}>
            Add Student
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <MdSchool />
          </div>
          <h4>Create New Course</h4>
          <p>Add a new course or program</p>
          <button className="action-btn primary" onClick={() => window.location.href = '/admin?tab=courses'}>
            Create Course
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <MdSchedule />
          </div>
          <h4>Schedule Class</h4>
          <p>Schedule a new class or session</p>
          <button className="action-btn primary" onClick={() => window.location.href = '/admin?tab=classes'}>
            Schedule Class
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <MdEmail />
          </div>
          <h4>Send Notifications</h4>
          <p>Send announcements to students</p>
          <button className="action-btn secondary">
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="security-section">
      <h3><MdSecurity /> Security & Access</h3>
      <div className="security-grid">
        <div className="security-card">
          <h4>Account Security</h4>
          <div className="security-item">
            <span>Password Last Changed:</span>
            <span>2 weeks ago</span>
          </div>
          <div className="security-item">
            <span>Two-Factor Authentication:</span>
            <span className="status-enabled">Enabled</span>
          </div>
          <div className="security-item">
            <span>Last Login:</span>
            <span>Today at 9:30 AM</span>
          </div>
          <div className="security-actions">
            <button className="security-btn">Change Password</button>
            <button className="security-btn">Enable 2FA</button>
          </div>
        </div>

        <div className="security-card">
          <h4>Access Permissions</h4>
          <div className="permission-item">
            <span>Student Management:</span>
            <span className="permission-granted">Full Access</span>
          </div>
          <div className="permission-item">
            <span>Course Management:</span>
            <span className="permission-granted">Full Access</span>
          </div>
          <div className="permission-item">
            <span>Class Management:</span>
            <span className="permission-granted">Full Access</span>
          </div>
          <div className="permission-item">
            <span>System Settings:</span>
            <span className="permission-granted">Full Access</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-account-page">
      <div className="account-header">
        <h1><MdDashboard /> Admin Account</h1>
        <p>Manage your administrator profile and system access</p>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <MdPerson /> Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <MdDashboard /> System Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <MdSettings /> Quick Actions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <MdSecurity /> Security
        </button>
      </div>

      <div className="account-content">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'overview' && renderSystemOverview()}
        {activeTab === 'actions' && renderQuickActions()}
        {activeTab === 'security' && renderSecurity()}
      </div>
    </div>
  );
};

export default AdminAccount; 