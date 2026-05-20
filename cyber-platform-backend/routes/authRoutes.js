const express = require('express');
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getProfile,
  getMyCourses
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validationMiddleware');
const {
  registerValidator,
  loginValidator,
  googleLoginValidator
} = require('../validators/authValidators');

router.get('/my-courses', protect, getMyCourses);

router.post(
  '/register',
  registerValidator,
  handleValidationErrors,
  register
);

router.post(
  '/login',
  loginValidator,
  handleValidationErrors,
  login
);

router.post(
  '/google-login',
  googleLoginValidator,
  handleValidationErrors,
  googleLogin
);

router.get('/profile', protect, getProfile);

module.exports = router;