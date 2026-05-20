const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'نص السؤال مطلوب'],
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length >= 2;
        },
        message: 'يجب أن يحتوي السؤال على خيارين على الأقل'
      }
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0
    },
    explanation: {
      type: String,
      default: ''
    }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان الكويز مطلوب'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: true
    },
    passingScore: {
      type: Number,
      default: 60
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);