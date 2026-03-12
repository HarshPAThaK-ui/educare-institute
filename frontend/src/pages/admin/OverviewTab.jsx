import React from 'react';
import { MdPeople, MdSchool, MdSchedule } from 'react-icons/md';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import SkeletonBlock from '../../components/skeleton/SkeletonBlock';

const OverviewTab = ({ users, courses, classes, loading }) => {
  if (loading) {
    return (
      <div className="overview-section">
        <div className="stats-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`overview-stat-skeleton-${index}`} />
          ))}
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <SkeletonBlock width="60%" height={16} />
                <SkeletonBlock width="40%" height={12} />
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <SkeletonBlock width="65%" height={16} />
                <SkeletonBlock width="45%" height={12} />
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <SkeletonBlock width="55%" height={16} />
                <SkeletonBlock width="35%" height={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <MdPeople />
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Students</p>
            <span className="stat-change positive">+{users.filter((u) => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon courses">
            <MdSchool />
          </div>
          <div className="stat-content">
            <h3>{courses.length}</h3>
            <p>Active Courses</p>
            <span className="stat-change positive">+{courses.filter((c) => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">
            <MdSchedule />
          </div>
          <div className="stat-content">
            <h3>{classes.length}</h3>
            <p>Classes This Week</p>
            <span className="stat-change neutral">No change</span>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          {users.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">
                <MdPeople />
              </div>
              <div className="activity-content">
                <p><strong>Latest Student:</strong> {users[0]?.name} joined</p>
                <span className="activity-time">{new Date(users[0]?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
          {classes.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">
                <MdSchedule />
              </div>
              <div className="activity-content">
                <p><strong>Latest Class:</strong> {classes[0]?.title} on {new Date(classes[0]?.date).toLocaleDateString()}</p>
                <span className="activity-time">{classes[0]?.startTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewTab);
