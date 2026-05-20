const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('الاسم مطلوب')
    .isLength({ min: 3 })
    .withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('صيغة البريد الإلكتروني غير صحيحة')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('صيغة البريد الإلكتروني غير صحيحة')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
];

const googleLoginValidator = [
  body('credential')
    .notEmpty()
    .withMessage('Google credential مطلوب')
];

module.exports = {
  registerValidator,
  loginValidator,
  googleLoginValidator
};