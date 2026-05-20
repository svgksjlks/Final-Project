// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان الكورس مطلوب'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'وصف الكورس مطلوب']
    },
    thumbnail: {
        type: String,
        default: 'default-course.png'
    },
    category: {
        type: String,
        enum: [
            'مقدمة في الأمن السيبراني',
            'أساسيات الشبكات',
            'أساسيات أنظمة التشغيل',
            'أمن المعلومات',
            'الهجمات السيبرانية',
            'الاختراق الأخلاقي'
        ],
        required: true
    },
    level: {
        type: String,
        enum: ['مبتدئ', 'متوسط', 'متقدم'],
        default: 'مبتدئ'
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    duration: {
        type: String // مثلاً "5 ساعات"
    },
    studentsEnrolled: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);