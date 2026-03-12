const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const getAuthToken = () => localStorage.getItem('token');

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
};

const request = async (path, { method = 'GET', token, body, headers = {} } = {}) => {
  const resolvedToken = token || getAuthToken();
  const options = {
    method,
    headers: buildHeaders(resolvedToken, headers),
  };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  return parseResponse(response);
};

export const getCoreData = async () => {
  const [usersData, coursesData, classesData] = await Promise.all([
    request('/users'),
    request('/courses'),
    request('/classes'),
  ]);

  return {
    users: usersData?.users || [],
    courses: coursesData?.courses || [],
    classes: classesData?.classes || [],
  };
};

export const getPendingUsers = async () => {
  const data = await request('/users/pending');
  return data?.users || [];
};

export const getNotes = async () => {
  const data = await request('/notes');
  return data?.notes || [];
};

export const createUser = async (payload) =>
  request('/user', { method: 'POST', body: payload });

export const updateUser = async (userId, payload) =>
  request(`/user/${userId}`, { method: 'PUT', body: payload });

export const deleteUser = async (userId) =>
  request(`/user/${userId}`, { method: 'DELETE' });

export const createCourse = async (payload) =>
  request('/course/new', { method: 'POST', body: payload });

export const updateCourse = async (courseId, payload) =>
  request(`/course/${courseId}`, { method: 'PUT', body: payload });

export const deleteCourse = async (courseId) =>
  request(`/course/${courseId}`, { method: 'DELETE' });

export const createClass = async (payload) =>
  request('/class/new', { method: 'POST', body: payload });

export const updateClass = async (classId, payload) =>
  request(`/class/${classId}`, { method: 'PUT', body: payload });

export const deleteClass = async (classId) =>
  request(`/class/${classId}`, { method: 'DELETE' });

export const approveUser = async (userId) =>
  request(`/user/${userId}/approve`, { method: 'PUT' });

export const rejectUser = async (userId) =>
  request(`/user/${userId}/reject`, { method: 'PUT' });

export const deleteNote = async (noteId) =>
  request(`/notes/${noteId}`, { method: 'DELETE' });

export const createOrUpdateNote = async (noteForm, noteFile, noteId = null) => {
  const formData = new FormData();
  formData.append('title', noteForm.title);
  formData.append('content', noteForm.content);
  formData.append('class', noteForm.class);
  if (noteForm.subject) formData.append('subject', noteForm.subject);
  if (noteFile) formData.append('file', noteFile);

  const path = noteId ? `/notes/${noteId}` : '/notes';
  const method = noteId ? 'PUT' : 'POST';

  return request(path, {
    method,
    body: formData,
  });
};

export { ApiError };
