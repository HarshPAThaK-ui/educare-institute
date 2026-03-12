import React from 'react';
import { MdDashboard, MdSchool, MdSchedule, MdAssignment } from 'react-icons/md';

const navItems = [
  { id: 'overview', label: 'Overview', icon: MdDashboard },
  { id: 'courses', label: 'My Courses', icon: MdSchool },
  { id: 'schedule', label: 'Schedule', icon: MdSchedule },
  { id: 'notes', label: 'Notes', icon: MdAssignment },
];

const StudentSidebar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="student-sidebar">
      <h2 className="student-sidebar-logo">Educare Institute</h2>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`student-sidebar-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default StudentSidebar;
