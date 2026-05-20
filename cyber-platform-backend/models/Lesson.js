// models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان الدرس مطلوب']
    },
    content: {
        type: String,
        required: [true, 'محتوى الدرس مطلوب']
    },
    videoUrl: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    resources: [{
        title: String,
        url: String
    }],
    codeExamples: [{
        language: String,
        code: String,
        description: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);