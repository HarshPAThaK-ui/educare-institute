import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="course-card">
    <div className="course-header">
      <h4>{course.title}</h4>
      <span className={`status-badge ${course.isActive ? 'active' : 'inactive'}`}>
        {course.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
    <p className="course-description">{course.description}</p>
    <div className="course-details">
      <div className="detail-item">
        <strong>Fee:</strong> â‚¹{course.fee?.toLocaleString() || 'N/A'}
      </div>
      <div className="detail-item">
        <strong>Duration:</strong> {course.duration}
      </div>
      <div className="detail-item">
        <strong>Schedule:</strong> {course.schedule}
      </div>
      <div className="detail-item">
        <strong>Batch Size:</strong> {course.batchSize}
      </div>
    </div>
    <div className="course-actions">
      <button className="action-btn edit" onClick={() => onEdit(course)}>
        <MdEdit /> Edit
      </button>
      <button className="action-btn delete" onClick={() => onDelete(course._id)}>
        <MdDelete /> Delete
      </button>
    </div>
  </div>
);

export default React.memo(CourseCard);
