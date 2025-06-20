import React, { useState, useEffect } from 'react';
import './adminDashboard.css';
import { 
  MdDashboard, 
  MdPeople, 
  MdSchool, 
  MdSchedule, 
  MdSettings,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAssignment
} from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalForm, setModalForm] = useState({});
  const [modalView, setModalView] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', class: '6th' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteFile, setNoteFile] = useState(null);

  // API Base URL
  const API_BASE = 'http://localhost:5000/api/admin';

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
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`, { replace: true });
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching admin data with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        return;
      }
      
      // Fetch users
      console.log('Fetching users from:', `${API_BASE}/users`);
      const usersResponse = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Users response status:', usersResponse.status);
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Users data received:', usersData.users?.length || 0, 'users');
        setUsers(usersData.users || []);
        setAllUsers(usersData.users || []);
      } else {
        console.error('Users API Error:', usersResponse.status, usersResponse.statusText);
        if (usersResponse.status === 401) {
          toast.error('Authentication failed. Please login again.');
        } else {
          toast.error(`Failed to load users: ${usersResponse.status}`);
        }
      }

      // Fetch courses
      console.log('Fetching courses from:', `${API_BASE}/courses`);
      const coursesResponse = await fetch(`${API_BASE}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Courses response status:', coursesResponse.status);
      
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('Courses data received:', coursesData.courses?.length || 0, 'courses');
        setCourses(coursesData.courses || []);
        setAllCourses(coursesData.courses || []);
      } else {
        console.error('Courses API Error:', coursesResponse.status, coursesResponse.statusText);
        if (coursesResponse.status === 401) {
          toast.error('Authentication failed. Please login again.');
        } else {
          toast.error(`Failed to load courses: ${coursesResponse.status}`);
        }
      }

      // Fetch classes
      console.log('Fetching classes from:', `${API_BASE}/classes`);
      const classesResponse = await fetch(`${API_BASE}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Classes response status:', classesResponse.status);
      
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        console.log('Classes data received:', classesData.classes?.length || 0, 'classes');
        setClasses(classesData.classes || []);
      } else {
        console.error('Classes API Error:', classesResponse.status, classesResponse.statusText);
        if (classesResponse.status === 401) {
          toast.error('Authentication failed. Please login again.');
        } else {
          toast.error(`Failed to load classes: ${classesResponse.status}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        toast.error('Failed to load data: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    setLoadingPending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/users/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingUsers(data.users || []);
      } else {
        setPendingUsers([]);
      }
    } catch (err) {
      setPendingUsers([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        setNotes([]);
      }
    } catch (err) {
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === 'pending') fetchPendingUsers();
    if (activeTab === 'notes') fetchNotes();
  }, [activeTab]);

  // Helper to reset modal form
  const resetModalForm = () => setModalForm({});

  // Open modal for add/edit/view
  const openModal = (type, item, view = false) => {
    setModalType(type);
    setSelectedItem(item);
    setModalView(view);
    setShowAddModal(true);
    setModalForm(item ? { ...item, subjects: Array.isArray(item.subjects) ? item.subjects.join(', ') : item.subjects, topics: Array.isArray(item.topics) ? item.topics.join(', ') : item.topics } : {});
  };

  // Modal form change handler
  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  // Modal submit handler
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSavingModal(true);
    const token = localStorage.getItem('token');
    let url = '', method = 'POST', body = {}, isEdit = !!selectedItem;
    try {
      if (modalType === 'user') {
        url = isEdit ? `${API_BASE}/user/${selectedItem._id}` : `${API_BASE}/user`;
        method = isEdit ? 'PUT' : 'POST';
        body = { ...modalForm, courses: Array.isArray(modalForm.courses) ? modalForm.courses : (modalForm.courses ? [modalForm.courses] : []) };
      } else if (modalType === 'course') {
        url = isEdit ? `${API_BASE}/course/${selectedItem._id}` : `${API_BASE}/course/new`;
        method = isEdit ? 'PUT' : 'POST';
        body = { ...modalForm, subjects: modalForm.subjects?.split(',').map(s => s.trim()) };
      } else if (modalType === 'class') {
        url = isEdit ? `${API_BASE}/class/${selectedItem._id}` : `${API_BASE}/class/new`;
        method = isEdit ? 'PUT' : 'POST';
        let topicsArr = modalForm.topics;
        if (typeof topicsArr === 'string') {
          topicsArr = topicsArr.split(',').map(t => t.trim());
        }
        body = { ...modalForm, courseId: modalForm.course, topics: topicsArr, studentClass: modalForm.studentClass };
        delete body.course;
      }
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        let errorMsg = 'Failed to save';
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || `Request failed with status ${res.status}`;
        } catch (jsonError) {
          errorMsg = `Request failed with status ${res.status}`;
        }
        throw new Error(errorMsg);
      }

      toast.success(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${isEdit ? 'updated' : 'added'} successfully`);
      setShowAddModal(false);
      resetModalForm();
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSavingModal(false);
    }
  };

  // Modal form fields by type
  const renderModalForm = () => {
    if (modalView && selectedItem) {
      return (
        <div>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
      );
    }
    if (modalType === 'user') {
      return (
        <form onSubmit={handleModalSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={modalForm.name || ''} onChange={handleModalChange} placeholder="e.g., John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={modalForm.email || ''} onChange={handleModalChange} placeholder="e.g., john@example.com" required type="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={modalForm.password || ''} onChange={handleModalChange} placeholder="Enter password" required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={modalForm.phone || ''} onChange={handleModalChange} placeholder="e.g., +1 123-456-7890" />
          </div>
          <div className="form-group">
            <label>Student Class</label>
            <input name="studentClass" value={modalForm.studentClass || ''} onChange={handleModalChange} placeholder="e.g., 10th Grade" />
          </div>
          <div className="form-group">
            <label>Parent Name</label>
            <input name="parentName" value={modalForm.parentName || ''} onChange={handleModalChange} placeholder="e.g., Jane Doe" />
          </div>
          <div className="form-group">
            <label>Parent Phone</label>
            <input name="parentPhone" value={modalForm.parentPhone || ''} onChange={handleModalChange} placeholder="e.g., +1 123-456-7890" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={modalForm.address || ''} onChange={handleModalChange} placeholder="e.g., 1234 Elm St, City, State, ZIP" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={modalForm.status || 'active'} onChange={handleModalChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Courses</label>
            <select name="courses" multiple value={modalForm.courses || []} onChange={e => setModalForm({ ...modalForm, courses: Array.from(e.target.selectedOptions, o => o.value) })}>
              {allCourses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (selectedItem ? 'Update' : 'Add')}</button>
        </form>
      );
    }
    if (modalType === 'course') {
      return (
        <form onSubmit={handleModalSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={modalForm.title || ''} onChange={handleModalChange} placeholder="e.g., Class 10 Foundation" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={modalForm.description || ''} onChange={handleModalChange} placeholder="Detailed course description" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input name="category" value={modalForm.category || ''} onChange={handleModalChange} placeholder="e.g., Foundation, Competitive Exams" required />
          </div>
          <div className="form-group">
            <label>Fee (INR)</label>
            <input name="fee" value={modalForm.fee || ''} onChange={handleModalChange} placeholder="e.g., 8000" type="number" required />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input name="duration" value={modalForm.duration || ''} onChange={handleModalChange} placeholder="e.g., 12 months" required />
          </div>
          <div className="form-group">
            <label>Schedule</label>
            <input name="schedule" value={modalForm.schedule || ''} onChange={handleModalChange} placeholder="e.g., Mon-Fri, 4-6 PM" required />
          </div>
          <div className="form-group">
            <label>Batch Size</label>
            <input name="batchSize" value={modalForm.batchSize || ''} onChange={handleModalChange} placeholder="e.g., 15 students" required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Subjects</label>
            <input name="subjects" value={modalForm.subjects || ''} onChange={handleModalChange} placeholder="e.g., Physics, Chemistry, Math" required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={modalForm.location || ''} onChange={handleModalChange} placeholder="e.g., Online, Offline" required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="isActive" value={modalForm.isActive ? 'true' : 'false'} onChange={e => setModalForm({ ...modalForm, isActive: e.target.value === 'true' })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (selectedItem ? 'Update Course' : 'Add Course')}</button>
        </form>
      );
    }
    if (modalType === 'class') {
      return (
        <form onSubmit={handleModalSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={modalForm.title || ''} onChange={handleModalChange} placeholder="e.g., Math Class" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={modalForm.description || ''}
              onChange={handleModalChange}
              placeholder="Enter class description"
              required
            />
          </div>
          <div className="form-group">
            <label>Course</label>
            <select name="course" value={modalForm.course || ''} onChange={handleModalChange} required>
              <option value="">Select Course</option>
              {allCourses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              name="date"
              value={modalForm.date ? modalForm.date.slice(0, 10) : ''}
              onChange={handleModalChange}
              placeholder="e.g., 2024-05-15"
              type="date"
              required
            />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input name="startTime" value={modalForm.startTime || ''} onChange={handleModalChange} placeholder="e.g., 10:00 AM" type="time" />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input name="endTime" value={modalForm.endTime || ''} onChange={handleModalChange} placeholder="e.g., 12:00 PM" type="time" />
          </div>
          <div className="form-group">
            <label>Classroom</label>
            <input name="classroom" value={modalForm.classroom || ''} onChange={handleModalChange} placeholder="e.g., Room 101" />
          </div>
          <div className="form-group">
            <label>Teacher</label>
            <input name="teacher" value={modalForm.teacher || ''} onChange={handleModalChange} placeholder="e.g., Mr. Smith" />
          </div>
          <div className="form-group">
            <label>Topics</label>
            <input name="topics" value={modalForm.topics || ''} onChange={handleModalChange} placeholder="e.g., Algebra, Geometry" />
          </div>
          <div className="form-group">
            <label>Students</label>
            <select name="students" multiple value={modalForm.students || []} onChange={e => setModalForm({ ...modalForm, students: Array.from(e.target.selectedOptions, o => o.value) })}>
              {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={modalForm.status || 'scheduled'} onChange={handleModalChange}>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Batch/Class</label>
            <select
              name="studentClass"
              value={modalForm.studentClass || ''}
              onChange={handleModalChange}
              required
            >
              <option value="">Select Batch/Class</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (selectedItem ? 'Update' : 'Add')}</button>
        </form>
      );
    }
    return null;
  };

  const handleAddNew = (type) => {
    openModal(type);
  };

  const handleEdit = (type, item) => {
    openModal(type, item);
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        let endpoint = '';
        
        switch (type) {
          case 'user':
            endpoint = `${API_BASE}/user/${id}`;
            break;
          case 'course':
            endpoint = `${API_BASE}/course/${id}`;
            break;
          case 'class':
            endpoint = `${API_BASE}/class/${id}`;
            break;
          default:
            return;
        }

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
          fetchData(); // Refresh data
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleNoteFormChange = (e) => {
    setNoteForm({ ...noteForm, [e.target.name]: e.target.value });
  };

  const handleAddNote = () => {
    setNoteForm({ title: '', class: '6th' });
    setNoteFile(null);
    setEditingNoteId(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note) => {
    setNoteForm({ title: note.title, class: note.class });
    setNoteFile(null);
    setEditingNoteId(note._id);
    setShowNoteModal(true);
  };

  const handleNoteFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleDeleteNote = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/admin/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      toast.success('Note deleted');
      fetchNotes();
    } else {
      toast.error('Failed to delete note');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingNoteId ? 'PUT' : 'POST';
    const url = editingNoteId
      ? `http://localhost:5000/api/admin/notes/${editingNoteId}`
      : 'http://localhost:5000/api/admin/notes';
    const formData = new FormData();
    formData.append('title', noteForm.title);
    formData.append('class', noteForm.class);
    if (noteFile) formData.append('file', noteFile);
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    if (res.ok) {
      toast.success(editingNoteId ? 'Note updated' : 'Note added');
      setShowNoteModal(false);
      fetchNotes();
    } else {
      toast.error('Failed to save note');
    }
  };

  const handleApproveUser = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/admin/user/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      toast.success('Student approved');
      fetchPendingUsers();
      fetchData();
    } else {
      toast.error('Failed to approve');
    }
  };

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

  const renderUserManagement = () => (
    <div className="user-management">
      <div className="section-header">
        <h3>Student Management</h3>
        <button className="add-btn" onClick={() => handleAddNew('user')}>
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

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
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
              {users
                .filter(user => 
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
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
                      <button className="action-btn edit" onClick={() => openModal('user', user)}>
                        <MdEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete('user', user._id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCourseManagement = () => (
    <div className="course-management">
      <div className="section-header">
        <h3>Course Management</h3>
        <button className="add-btn" onClick={() => handleAddNew('course')}>
          <MdAdd /> Add New Course
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <h4>{course.title}</h4>
                <span className={`status-badge ${course.isActive ? 'active' : 'inactive'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="course-description">{course.description}</p>
              <div className="course-details">
                <div className="detail-item">
                  <strong>Fee:</strong> ₹{course.fee?.toLocaleString() || 'N/A'}
                </div>
                <div className="detail-item">
                  <strong>Duration:</strong> {course.duration}
                </div>
                <div className="detail-item">
                  <strong>Schedule:</strong> {course.schedule}
                </div>
                <div className="detail-item">
                  <strong>Batch Size:</strong> {course.batchSize}
                </div>
              </div>
              <div className="course-actions">
                <button className="action-btn edit" onClick={() => openModal('course', course)}>
                  <MdEdit /> Edit
                </button>
                <button className="action-btn delete" onClick={() => handleDelete('course', course._id)}>
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderClassManagement = () => (
    <div className="class-management">
      <div className="section-header">
        <h3>Class Management</h3>
        <button className="add-btn" onClick={() => handleAddNew('class')}>
          <MdAdd /> Schedule Class
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading classes...</div>
      ) : (
        <div className="classes-grid">
          {classes.map(cls => (
            <div key={cls._id} className="class-card">
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
                <button className="action-btn edit" onClick={() => openModal('class', cls)}>
                  <MdEdit /> Edit
                </button>
                <button className="action-btn delete" onClick={() => handleDelete('class', cls._id)}>
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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

  const renderPendingStudents = () => (
    <div className="pending-students-section">
      <div className="section-header">
        <h3>Pending Student Approvals</h3>
      </div>
      {loadingPending ? (
        <div className="loading">Loading pending students...</div>
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
              {pendingUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleApproveUser(u._id)}>Approve</button>
                    <button className="action-btn delete" onClick={() => handleRejectUser(u._id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderNotesTab = () => (
    <div className="notes-section">
      <div className="section-header">
        <h3>Class Notes</h3>
        <button className="add-btn" onClick={handleAddNote}>Add Note</button>
      </div>
      {loadingNotes ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div>No notes available.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={note._id}>
                  <td>{note.title}</td>
                  <td>{note.class}</td>
                  <td>
                    <a href={`/${note.pdf.replace('\\', '/')}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEditNote(note)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingNoteId ? 'Edit Note' : 'Add Note'}</h2>
              <button className="close-btn" onClick={() => setShowNoteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleNoteSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" value={noteForm.title} onChange={handleNoteFormChange} required />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select name="class" value={noteForm.class} onChange={handleNoteFormChange} required>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>PDF File</label>
                  <input type="file" accept="application/pdf" onChange={handleNoteFileChange} required={!editingNoteId} />
                </div>
                <button type="submit" disabled={loadingNotes}>{editingNoteId ? 'Update Note' : 'Add Note'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><MdDashboard /> Admin Dashboard</h1>
        <p>Manage students, courses, and classes</p>
        
        {/* Quick Navigation */}
        <div className="quick-nav">
          <button 
            className={`quick-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <MdDashboard /> Overview
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => handleTabChange('students')}
          >
            <MdPeople /> Students
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => handleTabChange('courses')}
          >
            <MdSchool /> Courses
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => handleTabChange('classes')}
          >
            <MdSchedule /> Classes
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <MdSettings /> Settings
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            <MdPeople /> Pending Students
          </button>
          <button 
            className={`quick-nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => handleTabChange('notes')}
          >
            <MdAssignment /> Notes
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderUserManagement()}
        {activeTab === 'courses' && renderCourseManagement()}
        {activeTab === 'classes' && renderClassManagement()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'pending' && renderPendingStudents()}
        {activeTab === 'notes' && renderNotesTab()}
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalView ? 'View' : (selectedItem ? 'Edit' : 'Add')} {modalType}</h2>
              <button className="close-btn" onClick={() => { setShowAddModal(false); setModalView(false); resetModalForm(); }}>×</button>
            </div>
            <div className="modal-body">
              {renderModalForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 