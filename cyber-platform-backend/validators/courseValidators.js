const { body, param } = require('express-validator');

const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('عنوان الكورس مطلوب')
    .isLength({ min: 3 })
    .withMessage('عنوان الكورس يجب أن يكون 3 أحرف على الأقل'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('وصف الكورس مطلوب')
    .isLength({ min: 10 })
    .withMessage('وصف الكورس يجب أن يكون 10 أحرف على الأقل'),

  body('category')
    .notEmpty()
    .withMessage('تصنيف الكورس مطلوب'),

  body('level')
    .optional()
    .isIn(['مبتدئ', 'متوسط', 'متقدم'])
    .withMessage('المستوى غير صالح'),

  body('duration')
    .optional()
    .isString()
    .withMessage('المدة يجب أن تكون نصًا')
];

const courseIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح')
];

const createLessonValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('عنوان الدرس مطلوب'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('محتوى الدرس مطلوب'),

  body('order')
    .notEmpty()
    .withMessage('ترتيب الدرس مطلوب')
    .isInt({ min: 1 })
    .withMessage('ترتيب الدرس يجب أن يكون رقمًا صحيحًا أكبر من 0')
];

module.exports = {
  createCourseValidator,
  courseIdValidator,
  createLessonValidator
};