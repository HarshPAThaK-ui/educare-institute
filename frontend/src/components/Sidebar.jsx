import React from 'react';
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdSchedule,
  MdAssignment,
  MdHourglassTop,
  MdSettings,
} from 'react-icons/md';

const items = [
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
    <nav>
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
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

export default Sidebar;
