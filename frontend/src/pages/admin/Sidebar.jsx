import React from 'react';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdSchedule,
  MdAssignment,
  MdHourglassTop,
  MdSettings,
} from 'react-icons/md';

const navItems = [
  { id: 'overview', label: 'Overview', icon: MdDashboard },
  { id: 'students', label: 'Students', icon: MdPeople },
  { id: 'courses', label: 'Courses', icon: MdSchool },
  { id: 'classes', label: 'Classes', icon: MdSchedule },
  { id: 'notes', label: 'Notes', icon: MdAssignment },
  { id: 'pending', label: 'Pending', icon: MdHourglassTop },
  { id: 'settings', label: 'Settings', icon: MdSettings },
];

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="sidebar">
      <h2 className="sidebar-logo">Educare Institute</h2>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`sidebar-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          {activeTab === id && (
            <motion.div
              className="sidebar-indicator"
              layoutId="activeIndicator"
              transition={{ type: 'spring', stiffness: 600, damping: 40 }}
            />
          )}
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
