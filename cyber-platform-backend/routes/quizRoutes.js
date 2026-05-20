const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const {
  getQuizById,
  getQuizByCourse,
  submitQuiz
} = require('../controllers/quizController');

router.get('/:id', protect, getQuizById);
router.get('/course/:courseId', protect, getQuizByCourse);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;