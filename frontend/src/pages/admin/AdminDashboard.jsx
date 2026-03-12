import React, { useState, useEffect, useCallback } from 'react';
import './adminDashboard.css';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  MdDashboard, 
  MdPeople, 
  MdSchool, 
  MdSchedule, 
  MdSettings,
  MdAdd,
  MdEdit,
  MdDelete,
  MdFilterList,
  MdVisibility,
  MdEmail,
  MdLocationOn,
  MdAssignment
} from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StudentsTab from './StudentsTab';
import CoursesTab from './CoursesTab';
import ClassesTab from './ClassesTab';
import NotesTab from './NotesTab';
import PendingStudentsTab from './PendingStudentsTab';
import EntityModal from './EntityModal';
import Sidebar from './Sidebar';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loading from '../../components/loading/Loading';
import {
  getCoreData,
  getPendingUsers as getPendingUsersService,
  getNotes as getNotesService,
  deleteUser as deleteUserService,
  deleteCourse as deleteCourseService,
  deleteClass as deleteClassService,
  approveUser as approveUserService,
  rejectUser as rejectUserService,
  deleteNote as deleteNoteService,
  createOrUpdateNote as createOrUpdateNoteService,
} from './adminDashboard.service';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Handle URL query parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && ['overview', 'students', 'courses', 'classes', 'settings', 'pending', 'notes'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('overview');
    }
  }, [location.search]);

  // Function to change tab and update URL
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`, { replace: true });
  }, [navigate]);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCoreData();
      setUsers(data.users || []);
      setCourses(data.courses || []);
      setClasses(data.classes || []);
    } catch (error) {
      if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        toast.error(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingUsers = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await getPendingUsersService();
      setPendingUsers(data || []);
    } catch (err) {
      setPendingUsers([]);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      const data = await getNotesService();
      setNotes(data || []);
    } catch (err) {
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      await fetchData();
      if (isMounted) {
        setInitialLoading(false);
      }
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'pending') fetchPendingUsers();
    if (activeTab === 'notes') fetchNotes();
  }, [activeTab, fetchPendingUsers, fetchNotes]);

  const handleSidebarTabChange = useCallback((tab, setSidebarOpen) => {
    handleTabChange(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [handleTabChange]);

  const handleAddNew = useCallback((type) => {
    setModalType(type);
    setSelectedItem(null);
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback(async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        switch (type) {
          case 'user':
            await deleteUserService(id);
            break;
          case 'course':
            await deleteCourseService(id);
            break;
          case 'class':
            await deleteClassService(id);
            break;
          default:
            return;
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        await fetchData(); // Refresh data
      } catch (error) {
        toast.error(error.message || 'Failed to delete item');
      }
    }
  }, [fetchData]);

  const handleAddUser = useCallback(() => {
    handleAddNew('user');
  }, [handleAddNew]);

  const handleEditUser = useCallback((user) => {
    setModalType('user');
    setSelectedItem(user);
    setShowAddModal(true);
  }, []);

  const handleDeleteUser = useCallback((id) => {
    handleDelete('user', id);
  }, [handleDelete]);

  const handleAddCourse = useCallback(() => {
    handleAddNew('course');
  }, [handleAddNew]);

  const handleEditCourse = useCallback((course) => {
    setModalType('course');
    setSelectedItem(course);
    setShowAddModal(true);
  }, []);

  const handleDeleteCourse = useCallback((id) => {
    handleDelete('course', id);
  }, [handleDelete]);

  const handleAddClass = useCallback(() => {
    handleAddNew('class');
  }, [handleAddNew]);

  const handleEditClass = useCallback((cls) => {
    setModalType('class');
    setSelectedItem(cls);
    setShowAddModal(true);
  }, []);

  const handleDeleteClass = useCallback((id) => {
    handleDelete('class', id);
  }, [handleDelete]);

  const handleApproveUser = useCallback(async (id) => {
    try {
      await approveUserService(id);
      toast.success('Student approved');
      await fetchPendingUsers();
      await fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to approve');
    }
  }, [fetchPendingUsers, fetchData]);

  const handleRejectUser = useCallback(async (id) => {
    try {
      await rejectUserService(id);
      toast.success('Student rejected');
      await fetchPendingUsers();
      await fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to reject');
    }
  }, [fetchPendingUsers, fetchData]);

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <MdPeople />
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Students</p>
            <span className="stat-change positive">+{users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon courses">
            <MdSchool />
          </div>
          <div className="stat-content">
            <h3>{courses.length}</h3>
            <p>Active Courses</p>
            <span className="stat-change positive">+{courses.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month</span>
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

  const renderSettings = () => (
    <div className="settings-section">
      <h3>Admin Settings</h3>
      <div className="settings-grid">
        <div className="setting-card">
          <h4>System Information</h4>
          <div className="setting-item">
            <span>Total Students:</span>
            <span>{users.length}</span>
          </div>
          <div className="setting-item">
            <span>Total Courses:</span>
            <span>{courses.length}</span>
          </div>
          <div className="setting-item">
            <span>Total Classes:</span>
            <span>{classes.length}</span>
          </div>
        </div>
        <div className="setting-card">
          <h4>Quick Actions</h4>
          <button className="setting-btn" onClick={() => handleAddNew('user')}>
            Add New Student
          </button>
          <button className="setting-btn" onClick={() => handleAddNew('course')}>
            Add New Course
          </button>
          <button className="setting-btn" onClick={() => handleAddNew('class')}>
            Schedule Class
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {initialLoading ? (
        <Loading />
      ) : (
        <DashboardLayout
          sidebar={({ setSidebarOpen }) => (
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => handleSidebarTabChange(tab, setSidebarOpen)}
            />
          )}
        >
          <div className="dashboard-header">
            <h1><MdDashboard /> Admin Dashboard</h1>
            <p>Manage students, courses, and classes</p>
          </div>

          <div className="dashboard-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'students' && (
                  <StudentsTab
                    users={users}
                    loading={loading}
                    onAdd={handleAddUser}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                )}
                {activeTab === 'courses' && (
                  <CoursesTab
                    courses={courses}
                    loading={loading}
                    onAdd={handleAddCourse}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                  />
                )}
                {activeTab === 'classes' && (
                  <ClassesTab
                    classes={classes}
                    loading={loading}
                    onAdd={handleAddClass}
                    onEdit={handleEditClass}
                    onDelete={handleDeleteClass}
                  />
                )}
                {activeTab === 'settings' && renderSettings()}
                {activeTab === 'pending' && (
                  <PendingStudentsTab
                    pendingUsers={pendingUsers}
                    loadingPending={loadingPending}
                    onApprove={handleApproveUser}
                    onReject={handleRejectUser}
                  />
                )}
                {activeTab === 'notes' && (
                  <NotesTab
                    notes={notes}
                    loading={loadingNotes}
                    createOrUpdateNote={createOrUpdateNoteService}
                    deleteNote={deleteNoteService}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </DashboardLayout>
      )}

      <EntityModal
        isOpen={showAddModal}
        type={modalType}
        selectedItem={selectedItem}
        onClose={() => {
          setShowAddModal(false);
          setSelectedItem(null);
          setModalType('');
        }}
        refreshData={fetchData}
      />
    </div>
  );
};

export default AdminDashboard; 



