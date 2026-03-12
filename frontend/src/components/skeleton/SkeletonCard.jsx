import React from 'react';
import SkeletonBlock from './SkeletonBlock';
import './skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <SkeletonBlock width="60%" height={22} />
      <div className="skeleton-card-lines">
        <SkeletonBlock width="100%" height={14} />
        <SkeletonBlock width="92%" height={14} />
        <SkeletonBlock width="76%" height={14} />
      </div>
    </div>
  );
};

export default SkeletonCard;
