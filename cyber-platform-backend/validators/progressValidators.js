const { body, param } = require('express-validator');

const courseProgressValidator = [
  param('courseId')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح')
];

const markLessonCompleteValidator = [
  param('courseId')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح'),

  param('lessonId')
    .isMongoId()
    .withMessage('معرف الدرس غير صالح')
];

const saveQuizScoreValidator = [
  param('courseId')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح'),

  param('quizId')
    .isMongoId()
    .withMessage('معرف الاختبار غير صالح'),

  body('score')
    .notEmpty()
    .withMessage('النتيجة مطلوبة')
    .isNumeric()
    .withMessage('النتيجة يجب أن تكون رقمًا')
    .custom((value) => value >= 0 && value <= 100)
    .withMessage('النتيجة يجب أن تكون بين 0 و 100')
];

module.exports = {
  courseProgressValidator,
  markLessonCompleteValidator,
  saveQuizScoreValidator
};