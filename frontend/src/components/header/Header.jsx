import React, { useState } from 'react'
import './header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { MdDashboard, MdPerson, MdLogout, MdMenu, MdClose, MdSchool, MdPeople, MdSchedule, MdSettings } from 'react-icons/md';

const Header = ({isAuth, user, userRole}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logoutUser, loading } = UserData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser(navigate);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if user is in admin dashboard or admin account page
  const isInAdminDashboard = location.pathname === '/admin';
  const isInAdminAccount = location.pathname === '/account' && userRole === 'admin';
  const isInStudentDashboard = location.pathname === '/student';
  const isInStudentAccount = location.pathname === '/account' && userRole === 'student';

  return (
    <header>
      <div className="logo">
        <Link to="/">Educare Institute</Link>
      </div>
      
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        {/* Show different navigation based on user role and current page */}
        {isAuth && userRole === 'admin' && (isInAdminDashboard || isInAdminAccount) ? (
          // Admin Dashboard Navigation - Simplified when in dashboard
          <div className="admin-nav">
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              <MdDashboard /> Dashboard
            </Link>
            {/* Only show these links when not in admin dashboard to avoid redundancy */}
            {!isInAdminDashboard && (
              <>
                <Link to="/admin?tab=students" onClick={() => setIsMenuOpen(false)}>
                  <MdPeople /> Students
                </Link>
                <Link to="/admin?tab=courses" onClick={() => setIsMenuOpen(false)}>
                  <MdSchool /> Courses
                </Link>
                <Link to="/admin?tab=classes" onClick={() => setIsMenuOpen(false)}>
                  <MdSchedule /> Classes
                </Link>
                <Link to="/admin?tab=settings" onClick={() => setIsMenuOpen(false)}>
                  <MdSettings /> Settings
                </Link>
              </>
            )}
          </div>
        ) : isAuth && userRole === 'student' && (isInStudentDashboard || isInStudentAccount) ? (
          // Student Dashboard Navigation - Simplified when in dashboard
          <div className="student-nav">
            <Link to="/student" onClick={() => setIsMenuOpen(false)}>
              <MdDashboard /> Dashboard
            </Link>
            {/* Only show these links when not in student dashboard to avoid redundancy */}
            {!isInStudentDashboard && (
              <>
                <Link to="/student?tab=courses" onClick={() => setIsMenuOpen(false)}>
                  <MdSchool /> My Courses
                </Link>
                <Link to="/student?tab=schedule" onClick={() => setIsMenuOpen(false)}>
                  <MdSchedule /> Schedule
                </Link>
              </>
            )}
          </div>
        ) : (
          // Public Navigation (for non-authenticated users or when not in dashboard)
          <>
            <Link to={"/"} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to={"/programs"} onClick={() => setIsMenuOpen(false)}>Programs</Link>
            <Link to={"/about"} onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </>
        )}
        
        {!loading && isAuth ? (
          <div className="auth-links">
            {/* Role-based Dashboard Links - only show when not in respective dashboard */}
            {userRole === 'admin' && !isInAdminDashboard && !isInAdminAccount && (
              <Link to={"/admin"} onClick={() => setIsMenuOpen(false)}>
                <MdDashboard /> Admin Dashboard
              </Link>
            )}
            {userRole === 'student' && !isInStudentDashboard && !isInStudentAccount && (
              <Link to={"/student"} onClick={() => setIsMenuOpen(false)}>
                <MdDashboard /> Student Dashboard
              </Link>
            )}
            
            {/* User Menu */}
            <div className="user-menu">
              <Link to={"/account"} onClick={() => setIsMenuOpen(false)}>
                <MdPerson /> {userRole === 'admin' ? 'Admin Account' : 'Account'}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <MdLogout /> Logout
              </button>
            </div>
          </div>
        ) : !loading ? (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
        ) : null}
      </nav>
    </header>
  )
}

export default Header
