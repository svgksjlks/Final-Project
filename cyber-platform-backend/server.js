const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const hpp = require('hpp');

const connectDB = require('./config/db');

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// Security Headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/admin', require('./routes/adminRoutes'));


// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 request لكل IP
  message: {
    message: 'تم إرسال عدد كبير من الطلبات، حاول مرة أخرى بعد قليل'
  }
});

app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'مرحباً بك في منصة تعلم الأمن السيبراني 🔐' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'المسار غير موجود' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'خطأ في السيرفر'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});