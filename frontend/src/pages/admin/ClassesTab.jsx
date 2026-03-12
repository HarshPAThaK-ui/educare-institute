import React from 'react';
import { MdAdd } from 'react-icons/md';
import ClassCard from './ClassCard';
import SkeletonCard from '../../components/skeleton/SkeletonCard';

const ClassesTab = ({ classes, loading, onAdd, onEdit, onDelete }) => (
  <div className="class-management">
    <div className="section-header">
      <h3>Class Management</h3>
      <button className="add-btn" onClick={onAdd}>
        <MdAdd /> Schedule Class
      </button>
    </div>

    <div className="classes-grid">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`classes-skeleton-${index}`} />
          ))
        : classes.map((cls) => (
            <ClassCard
              key={cls._id}
              cls={cls}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
    </div>
  </div>
);

export default React.memo(ClassesTab);
