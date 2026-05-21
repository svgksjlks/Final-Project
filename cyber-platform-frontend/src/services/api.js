import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' 
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getProfileAPI = () => API.get('/auth/profile');
export const getMyCoursesAPI = () => API.get('/auth/my-courses');

// Course APIs
export const getCoursesAPI = () => API.get('/courses');
export const getCourseAPI = (id) => API.get(`/courses/${id}`);
export const getCourseLessonsAPI = (id) => API.get(`/courses/${id}/lessons`);
export const enrollCourseAPI = (id) => API.post(`/courses/${id}/enroll`);

// Quiz APIs
export const getQuizAPI = (id) => API.get(`/quizzes/${id}`);
export const getQuizByCourseAPI = (courseId) => API.get(`/quizzes/course/${courseId}`);
export const submitQuizAPI = (id, answers) =>
  API.post(`/quizzes/${id}/submit`, { answers });

// Progress APIs
export const getProgressAPI = (courseId) => API.get(`/progress/${courseId}`);
export const updateProgressAPI = (courseId, lessonId) =>
  API.post(`/progress/${courseId}/lesson/${lessonId}`);
export const saveQuizScoreAPI = (courseId, quizId, score) =>
  API.post(`/progress/${courseId}/quiz/${quizId}`, { score });

export const googleLoginAPI = (credential) =>
  API.post('/auth/google-login', { credential });

// Admin APIs
export const getAdminStatsAPI = () => API.get('/admin/stats');
export const getAdminUsersAPI = () => API.get('/admin/users');
export const updateUserRoleAPI = (id, role) =>
  API.patch(`/admin/users/${id}/role`, { role });
export const getAdminCourseLessonsAPI = (courseId) =>
  API.get(`/admin/courses/${courseId}/lessons`);

export const createAdminLessonAPI = (courseId, data) =>
  API.post(`/admin/courses/${courseId}/lessons`, data);

export const updateAdminLessonAPI = (lessonId, data) =>
  API.put(`/admin/lessons/${lessonId}`, data);

export const deleteAdminLessonAPI = (lessonId) =>
  API.delete(`/admin/lessons/${lessonId}`);

export const getAdminQuizzesByCourseAPI = (courseId) =>
  API.get(`/admin/courses/${courseId}/quizzes`);

export const createAdminQuizAPI = (courseId, data) =>
  API.post(`/admin/courses/${courseId}/quizzes`, data);

export const updateAdminQuizAPI = (quizId, data) =>
  API.put(`/admin/quizzes/${quizId}`, data);

export const deleteAdminQuizAPI = (quizId) =>
  API.delete(`/admin/quizzes/${quizId}`);

export const addQuestionToQuizAPI = (quizId, data) =>
  API.post(`/admin/quizzes/${quizId}/questions`, data);

export const updateQuestionInQuizAPI = (quizId, questionId, data) =>
  API.put(`/admin/quizzes/${quizId}/questions/${questionId}`, data);

export const deleteQuestionFromQuizAPI = (quizId, questionId) =>
  API.delete(`/admin/quizzes/${quizId}/questions/${questionId}`);

export const getAdminCoursesAPI = () => API.get('/admin/courses');
export const createAdminCourseAPI = (data) => API.post('/admin/courses', data);
export const updateAdminCourseAPI = (id, data) => API.put(`/admin/courses/${id}`, data);
export const deleteAdminCourseAPI = (id) => API.delete(`/admin/courses/${id}`);
export const togglePublishCourseAPI = (id) => API.patch(`/admin/courses/${id}/publish`);

export default API;
