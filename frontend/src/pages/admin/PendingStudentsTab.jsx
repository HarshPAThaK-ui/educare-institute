import React from 'react';
import SkeletonTableRow from '../../components/skeleton/SkeletonTableRow';

const PendingStudentsTab = ({ pendingUsers, loadingPending, onApprove, onReject }) => (
  <div className="pending-students-section">
    <div className="section-header">
      <h3>Pending Student Approvals</h3>
    </div>
    {loadingPending ? (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonTableRow key={`pending-skeleton-${index}`} />
            ))}
          </tbody>
        </table>
      </div>
    ) : pendingUsers.length === 0 ? (
      <div>No pending students.</div>
    ) : (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button className="action-btn edit" onClick={() => onApprove(u._id)}>Approve</button>
                  <button className="action-btn delete" onClick={() => onReject(u._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default React.memo(PendingStudentsTab);
