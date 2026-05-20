const express = require('express');
const router = express.Router();

const {
  getCourseProgress,
  markLessonComplete,
  saveQuizScore
} = require('../controllers/progressController');

const { protect } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
  courseProgressValidator,
  markLessonCompleteValidator,
  saveQuizScoreValidator
} = require('../validators/progressValidators');

router.get(
  '/:courseId',
  protect,
  courseProgressValidator,
  handleValidationErrors,
  getCourseProgress
);

router.post(
  '/:courseId/lesson/:lessonId',
  protect,
  markLessonCompleteValidator,
  handleValidationErrors,
  markLessonComplete
);

router.post(
  '/:courseId/quiz/:quizId',
  protect,
  saveQuizScoreValidator,
  handleValidationErrors,
  saveQuizScore
);

module.exports = router;