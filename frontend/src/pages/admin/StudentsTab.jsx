import React, { useMemo, useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdPhone, MdSearch } from 'react-icons/md';
import SkeletonTableRow from '../../components/skeleton/SkeletonTableRow';

const StudentsTab = ({ users, loading, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  return (
    <div className="user-management">
      <div className="section-header">
        <h3>Student Management</h3>
        <button className="add-btn" onClick={onAdd}>
          <MdAdd /> Add New Student
        </button>
      </div>

      <div className="search-filter">
        <div className="search-box">
          <MdSearch />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Contact</th>
              <th>Class</th>
              <th>Parent Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={`students-skeleton-${index}`} />
                ))
              : filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span><MdPhone /> {user.phone}</span>
                    </div>
                  </td>
                  <td>{user.studentClass}</td>
                  <td>
                    <div className="parent-info">
                      <span>{user.parentName}</span>
                      <span className="parent-phone">{user.parentPhone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status || 'active'}`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => onEdit(user)}>
                        <MdEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => onDelete(user._id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(StudentsTab);
