import React from 'react';
import SkeletonBlock from './SkeletonBlock';
import './skeleton.css';

const SkeletonTableRow = () => {
  return (
    <tr className="skeleton-row" aria-hidden="true">
      <td><SkeletonBlock width="90%" height={14} /></td>
      <td><SkeletonBlock width="80%" height={14} /></td>
      <td><SkeletonBlock width="75%" height={14} /></td>
      <td><SkeletonBlock width="70%" height={14} /></td>
      <td><SkeletonBlock width="60%" height={14} /></td>
    </tr>
  );
};

export default SkeletonTableRow;
