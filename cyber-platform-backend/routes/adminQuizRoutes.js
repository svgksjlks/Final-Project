const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
  getQuizzesByCourseForAdmin,
  createQuizForCourseAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
  addQuestionToQuizAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin
} = require('../controllers/adminQuizController');

router.get('/courses/:courseId/quizzes', protect, admin, getQuizzesByCourseForAdmin);
router.post('/courses/:courseId/quizzes', protect, admin, createQuizForCourseAdmin);

router.put('/quizzes/:quizId', protect, admin, updateQuizAdmin);
router.delete('/quizzes/:quizId', protect, admin, deleteQuizAdmin);

router.post('/quizzes/:quizId/questions', protect, admin, addQuestionToQuizAdmin);
router.put('/quizzes/:quizId/questions/:questionId', protect, admin, updateQuestionAdmin);
router.delete('/quizzes/:quizId/questions/:questionId', protect, admin, deleteQuestionAdmin);

module.exports = router;