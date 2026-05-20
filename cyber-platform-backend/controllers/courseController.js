const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// جلب كل الكورسات المنشورة
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('lessons', 'title order')
      .sort('category');

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء جلب الكورسات',
      error: error.message
    });
  }
};

// جلب كورس واحد بالـ id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons');
      // .populate('quizzes');

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء جلب الكورس',
      error: error.message
    });
  }
};

// إنشاء كورس جديد
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      category,
      level,
      duration,
      isPublished
    } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      level,
      duration,
      isPublished
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء إنشاء الكورس',
      error: error.message
    });
  }
};

// التسجيل في كورس
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const user = req.user;

    const alreadyEnrolled = user.enrolledCourses.some(
      (courseId) => courseId.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'أنت مسجل بالفعل في هذا الكورس' });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    course.studentsEnrolled += 1;
    await course.save();

    res.status(200).json({ message: 'تم التسجيل في الكورس بنجاح' });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء التسجيل في الكورس',
      error: error.message
    });
  }
};

// جلب دروس كورس معين
const getCourseLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const lessons = await Lesson.find({ course: req.params.id }).sort({ order: 1 });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء جلب الدروس',
      error: error.message
    });
  }
};

// إضافة درس جديد إلى كورس
const createLessonForCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const { title, content, videoUrl, order, resources, codeExamples } = req.body;

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      order,
      resources,
      codeExamples,
      course: course._id
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في السيرفر أثناء إضافة الدرس',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  enrollCourse,
  getCourseLessons,
  createLessonForCourse
};