import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/dashboard/TopBar';
import { UserData } from '../context/UserContext';

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const DashboardLayout = ({ sidebar, children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logoutUser } = UserData();

  useEffect(() => {
    const syncSidebarState = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) {
        setSidebarOpen(true);
        return;
      }

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setSidebarOpen(false);
      }
    };

    syncSidebarState();
    window.addEventListener('resize', syncSidebarState);

    return () => window.removeEventListener('resize', syncSidebarState);
  }, []);

  useEffect(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : '';
      return;
    }

    document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
      return;
    }

    logoutUser(navigate);
  }, [onLogout, logoutUser, navigate]);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {typeof sidebar === 'function' ? sidebar({ sidebarOpen, setSidebarOpen }) : sidebar}
      </aside>

      <div className="dashboard-main">
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        {children}
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          onClick={handleCloseSidebar}
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
