import React, { useState, useEffect } from "react";
import "./account.css";
import { MdDashboard, MdSchool, MdSchedule, MdPerson, MdLogout } from "react-icons/md";

const Account = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    studentClass: user?.studentClass || '',
  });
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(user);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setProfile(data.user || editForm);
      setEditOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) throw new Error('Failed to change password');
      alert('Password changed successfully');
      setPasswordOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  useEffect(() => {
    setLoadingEnrollments(true);
    const token = localStorage.getItem('token');
    fetch('/api/course/my-enrollments', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setEnrollments(data.enrollments || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoadingEnrollments(false));
  }, []);

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedEnrollment(null);
  };

  const renderProfile = () => (
    <div className="profile-section">
      <h3><MdPerson /> Profile Information</h3>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <MdPerson />
          </div>
          <div className="profile-info">
            <h4>{profile?.name || 'Student Name'}</h4>
            <p>{profile?.email || 'student@example.com'}</p>
            <span className="role-badge">Student</span>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            <p>{profile?.name || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Email Address</label>
            <p>{profile?.email || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Phone Number</label>
            <p>{profile?.phone || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Address</label>
            <p>{profile?.address || 'Not provided'}</p>
          </div>
          <div className="detail-group">
            <label>Student Class</label>
            <p>{profile?.studentClass || 'Not specified'}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn" onClick={() => setEditOpen(true)}>Edit Profile</button>
          <button className="change-password-btn" onClick={() => setPasswordOpen(true)}>Change Password</button>
        </div>
      </div>
      {editOpen && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',borderRadius:8,padding:32,minWidth:320,maxWidth:400,boxShadow:'0 2px 16px rgba(0,0,0,0.2)',position:'relative'}}>
            <button onClick={()=>setEditOpen(false)} style={{position:'absolute',top:12,right:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>&times;</button>
            <h2 style={{marginBottom:16}}>Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{marginBottom:12}}>
                <label>Name</label>
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <div style={{marginBottom:12}}>
                <label>Phone</label>
                <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <div style={{marginBottom:12}}>
                <label>Address</label>
                <input type="text" name="address" value={editForm.address} onChange={handleEditChange} style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <div style={{marginBottom:16}}>
                <label>Student Class</label>
                <input type="text" name="studentClass" value={editForm.studentClass} onChange={handleEditChange} style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <button type="submit" disabled={saving} style={{width:'100%',padding:10,background:'#2c5aa0',color:'#fff',border:'none',borderRadius:4,fontWeight:600,cursor:'pointer'}}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
      {passwordOpen && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',borderRadius:8,padding:32,minWidth:320,maxWidth:400,boxShadow:'0 2px 16px rgba(0,0,0,0.2)',position:'relative'}}>
            <button onClick={()=>setPasswordOpen(false)} style={{position:'absolute',top:12,right:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>&times;</button>
            <h2 style={{marginBottom:16}}>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{marginBottom:12}}>
                <label>Current Password</label>
                <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <div style={{marginBottom:12}}>
                <label>New Password</label>
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <div style={{marginBottom:16}}>
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required style={{width:'100%',padding:8,marginTop:4}} />
              </div>
              <button type="submit" disabled={passwordSaving} style={{width:'100%',padding:10,background:'#2c5aa0',color:'#fff',border:'none',borderRadius:4,fontWeight:600,cursor:'pointer'}}>
                {passwordSaving ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnrollments = () => (
    <div className="enrollments-section">
      <h3><MdSchool /> My Enrollments</h3>
      {loadingEnrollments ? (
        <div>Loading enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div>No enrollments yet. Please contact your admin.</div>
      ) : (
        <div className="enrollments-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id || enrollment._id} className="enrollment-card">
              <div className="enrollment-header">
                <h4>{enrollment.courseTitle || enrollment.title}</h4>
                <span className="status-badge active">Active</span>
              </div>
              <div className="enrollment-details">
                <div className="detail-item">
                  <span>Enrolled Date:</span>
                  <span>{enrollment.enrolledDate ? new Date(enrollment.enrolledDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Schedule:</span>
                  <span>{enrollment.schedule || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Classroom:</span>
                  <span>{enrollment.classroom || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Teacher:</span>
                  <span>{enrollment.teacher || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span>Progress:</span>
                  <span>{enrollment.progress ? `${enrollment.progress}% Complete` : 'N/A'}</span>
                </div>
              </div>
              <div className="enrollment-actions">
                <button className="view-btn" onClick={() => handleViewDetails(enrollment)}>View Details</button>
                <button className="join-btn">Join Class</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {detailsOpen && selectedEnrollment && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',borderRadius:8,padding:32,minWidth:320,maxWidth:400,boxShadow:'0 2px 16px rgba(0,0,0,0.2)',position:'relative'}}>
            <button onClick={handleCloseDetails} style={{position:'absolute',top:12,right:12,background:'none',border:'none',fontSize:20,cursor:'pointer'}}>&times;</button>
            <h2 style={{marginBottom:16}}>Enrollment Details</h2>
            <div style={{marginBottom:12}}><strong>Course:</strong> {selectedEnrollment.courseTitle || selectedEnrollment.title}</div>
            <div style={{marginBottom:12}}><strong>Enrolled Date:</strong> {selectedEnrollment.enrolledDate ? new Date(selectedEnrollment.enrolledDate).toLocaleDateString() : 'N/A'}</div>
            <div style={{marginBottom:12}}><strong>Schedule:</strong> {selectedEnrollment.schedule || 'N/A'}</div>
            <div style={{marginBottom:12}}><strong>Classroom:</strong> {selectedEnrollment.classroom || 'N/A'}</div>
            <div style={{marginBottom:12}}><strong>Teacher:</strong> {selectedEnrollment.teacher || 'N/A'}</div>
            <div style={{marginBottom:12}}><strong>Progress:</strong> {selectedEnrollment.progress ? `${selectedEnrollment.progress}% Complete` : 'N/A'}</div>
            {/* Add more fields as needed */}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="account-page">
      <div className="account-header">
        <h1><MdDashboard /> My Account</h1>
        <p>Manage your profile, enrollments, and schedule</p>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <MdPerson /> Profile
        </button>
      </div>

      <div className="account-content">
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default Account;
