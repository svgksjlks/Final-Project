const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  getCourse,
  createCourse,
  enrollCourse,
  getCourseLessons,
  createLessonForCourse
} = require('../controllers/courseController');

const { protect, admin } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
  createCourseValidator,
  courseIdValidator,
  createLessonValidator
} = require('../validators/courseValidators');

// Public routes
router.get('/', getAllCourses);

router.get(
  '/:id',
  courseIdValidator,
  handleValidationErrors,
  getCourse
);

router.get(
  '/:id/lessons',
  courseIdValidator,
  handleValidationErrors,
  getCourseLessons
);

// Protected routes
router.post(
  '/',
  protect,
  admin,
  createCourseValidator,
  handleValidationErrors,
  createCourse
);

router.post(
  '/:id/enroll',
  protect,
  courseIdValidator,
  handleValidationErrors,
  enrollCourse
);

router.post(
  '/:id/lessons',
  protect,
  admin,
  createLessonValidator,
  handleValidationErrors,
  createLessonForCourse
);

module.exports = router;