const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getAllCoursesForAdmin,
  createCourseAdmin,
  updateCourseAdmin,
  deleteCourse,
  togglePublishCourse,
  updateUserRole,
  getLessonsByCourseForAdmin,
  createLessonForCourseAdmin,
  updateLessonAdmin,
  deleteLessonAdmin
} = require('../controllers/adminController');

router.get('/courses/:courseId/lessons', protect, admin, getLessonsByCourseForAdmin);
router.post('/courses/:courseId/lessons', protect, admin, createLessonForCourseAdmin);
router.put('/lessons/:lessonId', protect, admin, updateLessonAdmin);
router.delete('/lessons/:lessonId', protect, admin, deleteLessonAdmin);

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.patch('/users/:id/role', protect, admin, updateUserRole);

router.get('/courses', protect, admin, getAllCoursesForAdmin);
router.post('/courses', protect, admin, createCourseAdmin);
router.put('/courses/:id', protect, admin, updateCourseAdmin);
router.patch('/courses/:id/publish', protect, admin, togglePublishCourse);
router.delete('/courses/:id', protect, admin, deleteCourse);

module.exports = router;