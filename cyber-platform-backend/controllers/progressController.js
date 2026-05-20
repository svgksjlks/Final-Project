const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

// جلب progress كورس معين للمستخدم الحالي
const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    }).populate('completedLessons');

    if (!progress) {
      return res.json({
        user: req.user._id,
        course: req.params.courseId,
        completedLessons: [],
        quizScores: [],
        progressPercentage: 0,
        isCompleted: false
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
};

// تحديث التقدم عند إنهاء درس
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedLessons: [],
        quizScores: [],
        progressPercentage: 0,
        isCompleted: false
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;
    const completedCount = progress.completedLessons.length;

    progress.progressPercentage = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

    if (progress.progressPercentage === 100) {
      progress.isCompleted = true;
    }

    await progress.save();

    res.json({
      message: 'تم تحديث التقدم بنجاح',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
};

// حفظ نتيجة Quiz داخل progress
const saveQuizScore = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { score } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedLessons: [],
        quizScores: [],
        progressPercentage: 0,
        isCompleted: false
      });
    }

    const existingQuiz = progress.quizScores.find(
      (q) => q.quiz.toString() === quizId
    );

    if (existingQuiz) {
      existingQuiz.score = score;
      existingQuiz.completedAt = new Date();
    } else {
      progress.quizScores.push({
        quiz: quizId,
        score,
        completedAt: new Date()
      });
    }

    await progress.save();

    res.json({
      message: 'تم حفظ نتيجة الاختبار بنجاح',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
};

module.exports = {
  getCourseProgress,
  markLessonComplete,
  saveQuizScore
};