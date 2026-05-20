const express = require('express');
const router = express.Router();

const {
  createQuiz,
  getQuizById,
  getQuizByCourse,
  submitQuiz
} = require('../controllers/quizController');

const { protect, admin } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
  createQuizValidator,
  quizIdValidator,
  quizCourseIdValidator,
  submitQuizValidator
} = require('../validators/quizValidators');

router.get(
  '/course/:courseId',
  quizCourseIdValidator,
  handleValidationErrors,
  getQuizByCourse
);

router.get(
  '/:id',
  quizIdValidator,
  handleValidationErrors,
  getQuizById
);

router.post(
  '/course/:courseId',
  protect,
  admin,
  createQuizValidator,
  handleValidationErrors,
  createQuiz
);

router.post(
  '/:id/submit',
  protect,
  submitQuizValidator,
  handleValidationErrors,
  submitQuiz
);

module.exports = router;