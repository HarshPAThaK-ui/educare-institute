import React from 'react';
import './skeleton.css';

const SkeletonBlock = ({ width = '100%', height = 16 }) => {
  return (
    <div
      className="skeleton-block"
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export default SkeletonBlock;
