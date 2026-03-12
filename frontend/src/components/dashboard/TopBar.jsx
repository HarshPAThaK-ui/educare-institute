import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';

const MOBILE_BREAKPOINT = 768;

const TopBar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  ));
  const profileRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {isMobile && (
          <button
            type="button"
            className="topbar-menu-btn"
            onClick={handleToggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <MdClose /> : <MdMenu />}
          </button>
        )}
      </div>

      <div className="topbar-center">
        <span className="topbar-title-placeholder">Dashboard</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-profile" ref={profileRef}>
          <button
            type="button"
            className="profile-button"
            onClick={handleToggleMenu}
            aria-label="Open profile menu"
            aria-expanded={menuOpen}
          >
            EI
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Link
                  to="/account"
                  onClick={handleCloseMenu}
                  className="profile-dropdown-item"
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="profile-dropdown-item logout"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
