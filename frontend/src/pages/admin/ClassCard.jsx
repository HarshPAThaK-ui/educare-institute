import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

const ClassCard = ({ cls, onEdit, onDelete }) => (
  <div className="class-card">
    <div className="class-header">
      <h4>{cls.title}</h4>
      <span className={`status-badge ${cls.status || 'scheduled'}`}>
        {cls.status || 'scheduled'}
      </span>
    </div>
    <div className="class-details">
      <div className="detail-item">
        <strong>Course:</strong> {cls.course?.title || 'N/A'}
      </div>
      <div className="detail-item">
        <strong>Date:</strong> {new Date(cls.date).toLocaleDateString()}
      </div>
      <div className="detail-item">
        <strong>Time:</strong> {cls.startTime} - {cls.endTime}
      </div>
      <div className="detail-item">
        <strong>Classroom:</strong> {cls.classroom}
      </div>
      <div className="detail-item">
        <strong>Teacher:</strong> {cls.teacher}
      </div>
    </div>
    {cls.topics && cls.topics.length > 0 && (
      <div className="class-topics">
        <strong>Topics:</strong>
        <div className="topics-list">
          {cls.topics.map((topic, index) => (
            <span key={index} className="topic-tag">{topic}</span>
          ))}
        </div>
      </div>
    )}
    <div className="class-actions">
      <button className="action-btn edit" onClick={() => onEdit(cls)}>
        <MdEdit /> Edit
      </button>
      <button className="action-btn delete" onClick={() => onDelete(cls._id)}>
        <MdDelete /> Delete
      </button>
    </div>
  </div>
);

export default React.memo(ClassCard);
