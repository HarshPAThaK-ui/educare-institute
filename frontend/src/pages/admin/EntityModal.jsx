import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createUser as createUserService,
  updateUser as updateUserService,
  createCourse as createCourseService,
  updateCourse as updateCourseService,
  createClass as createClassService,
  updateClass as updateClassService,
  getCoreData,
} from './adminDashboard.service';

const EntityModal = ({ isOpen, type, selectedItem, onClose, refreshData }) => {
  const [modalForm, setModalForm] = useState({});
  const [savingModal, setSavingModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const isEdit = !!selectedItem;

  useEffect(() => {
    if (!isOpen) return;

    setModalForm(
      selectedItem
        ? {
            ...selectedItem,
            subjects: Array.isArray(selectedItem.subjects) ? selectedItem.subjects.join(', ') : selectedItem.subjects,
            topics: Array.isArray(selectedItem.topics) ? selectedItem.topics.join(', ') : selectedItem.topics,
          }
        : {}
    );
  }, [isOpen, selectedItem, type]);

  useEffect(() => {
    if (!isOpen) return;

    const loadOptions = async () => {
      try {
        const data = await getCoreData();
        setCourses(data.courses || []);
        setUsers(data.users || []);
      } catch {
        setCourses([]);
        setUsers([]);
      }
    };

    if (type === 'user' || type === 'class') {
      loadOptions();
    }
  }, [isOpen, type]);

  const handleModalChange = (e) => {
    setModalForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSavingModal(true);

    try {
      if (type === 'user') {
        const body = {
          ...modalForm,
          courses: Array.isArray(modalForm.courses)
            ? modalForm.courses
            : modalForm.courses
              ? [modalForm.courses]
              : [],
        };
        if (isEdit) {
          await updateUserService(selectedItem._id, body);
        } else {
          await createUserService(body);
        }
      } else if (type === 'course') {
        const body = {
          ...modalForm,
          subjects: modalForm.subjects?.split(',').map((s) => s.trim()),
        };
        if (isEdit) {
          await updateCourseService(selectedItem._id, body);
        } else {
          await createCourseService(body);
        }
      } else if (type === 'class') {
        let topicsArr = modalForm.topics;
        if (typeof topicsArr === 'string') {
          topicsArr = topicsArr.split(',').map((t) => t.trim());
        }
        const body = {
          ...modalForm,
          courseId: modalForm.course,
          topics: topicsArr,
          studentClass: modalForm.studentClass,
        };
        delete body.course;
        if (isEdit) {
          await updateClassService(selectedItem._id, body);
        } else {
          await createClassService(body);
        }
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${isEdit ? 'updated' : 'added'} successfully`);
      onClose();
      await refreshData();
    } catch (error) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSavingModal(false);
    }
  };

  const renderModalForm = () => {
    if (type === 'user') {
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
            <select
              name="courses"
              multiple
              value={modalForm.courses || []}
              onChange={(e) => setModalForm((prev) => ({ ...prev, courses: Array.from(e.target.selectedOptions, (o) => o.value) }))}
            >
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (isEdit ? 'Update' : 'Add')}</button>
        </form>
      );
    }

    if (type === 'course') {
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
            <select
              name="isActive"
              value={modalForm.isActive ? 'true' : 'false'}
              onChange={(e) => setModalForm((prev) => ({ ...prev, isActive: e.target.value === 'true' }))}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (isEdit ? 'Update Course' : 'Add Course')}</button>
        </form>
      );
    }

    if (type === 'class') {
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
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
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
            <select
              name="students"
              multiple
              value={modalForm.students || []}
              onChange={(e) => setModalForm((prev) => ({ ...prev, students: Array.from(e.target.selectedOptions, (o) => o.value) }))}
            >
              {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
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
            <select name="studentClass" value={modalForm.studentClass || ''} onChange={handleModalChange} required>
              <option value="">Select Batch/Class</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
          <button type="submit" disabled={savingModal}>{savingModal ? 'Saving...' : (isEdit ? 'Update' : 'Add')}</button>
        </form>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit' : 'Add'} {type}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">
          {renderModalForm()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EntityModal);

