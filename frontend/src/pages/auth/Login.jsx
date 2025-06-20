import React, { useState } from 'react'
import "./auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { MdAdminPanelSettings, MdPerson, MdSchool, MdWarning } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const{ btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState('student'); // 'student' or 'admin'

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, loginRole);
  }

  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Welcome to Educare Institute</h2>
            <p className="auth-subtitle">Please login to continue</p>
            
            {/* Role Selection Tabs */}
            <div className="role-tabs">
                <button 
                    className={`role-tab ${loginRole === 'student' ? 'active' : ''}`}
                    onClick={() => setLoginRole('student')}
                >
                    <MdPerson />
                    Student Login
                </button>
                <button 
                    className={`role-tab ${loginRole === 'admin' ? 'active' : ''}`}
                    onClick={() => setLoginRole('admin')}
                >
                    <MdAdminPanelSettings />
                    Admin Login
                </button>
            </div>

            {/* Role-specific content */}
            <div className="role-content">
                {loginRole === 'student' ? (
                    <div className="student-login">
                        <div className="role-icon">
                            <MdSchool />
                        </div>
                        <h3>Student Portal</h3>
                        <p>Access your courses, schedule, and assignments</p>
                        <div className="role-notice">
                            <MdWarning />
                            <span>Only students can access this portal</span>
                        </div>
                    </div>
                ) : (
                    <div className="admin-login">
                        <div className="role-icon">
                            <MdAdminPanelSettings />
                        </div>
                        <h3>Admin Portal</h3>
                        <p>Manage students, courses, and institute operations</p>
                        <div className="role-notice">
                            <MdWarning />
                            <span>Only administrators can access this portal</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={submitHandler}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginRole === 'admin' ? 'admin@educare.com' : 'student@example.com'}
                    required
                />

                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />

                <button 
                    disabled={btnLoading} 
                    type='submit' 
                    className={`common-btn ${loginRole === 'admin' ? 'admin-btn' : 'student-btn'}`}
                >
                    {btnLoading ? "Please wait.." : `Login as ${loginRole === 'admin' ? 'Admin' : 'Student'}`}
                </button>
            </form>

            <div className="auth-footer">
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
                <p className="role-note">
                    {loginRole === 'admin' 
                        ? "Admin access is restricted to authorized personnel only."
                        : "Students can register for new accounts or contact admin for access."
                    }
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login   
