import React from 'react';
import { MdAdd } from 'react-icons/md';
import CourseCard from './CourseCard';
import SkeletonCard from '../../components/skeleton/SkeletonCard';

const CoursesTab = ({ courses, loading, onAdd, onEdit, onDelete }) => (
  <div className="course-management">
    <div className="section-header">
      <h3>Course Management</h3>
      <button className="add-btn" onClick={onAdd}>
        <MdAdd /> Add New Course
      </button>
    </div>

    <div className="courses-grid">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`courses-skeleton-${index}`} />
          ))
        : courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
    </div>
  </div>
);

export default React.memo(CoursesTab);
