const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const coursesCount = await Course.countDocuments();
    const publishedCoursesCount = await Course.countDocuments({ isPublished: true });
    const lessonsCount = await Lesson.countDocuments();

    const totalEnrollmentsAgg = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: '$studentsEnrolled' }
        }
      }
    ]);

    const totalEnrollments = totalEnrollmentsAgg[0]?.totalEnrollments || 0;

    res.status(200).json({
      usersCount,
      coursesCount,
      publishedCoursesCount,
      lessonsCount,
      totalEnrollments
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب إحصائيات لوحة التحكم',
      error: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('enrolledCourses', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب المستخدمين',
      error: error.message
    });
  }
};

const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('lessons', 'title order')
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب الكورسات',
      error: error.message
    });
  }
};

const createCourseAdmin = async (req, res) => {
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

    if (!title || !description || !category) {
      return res.status(400).json({
        message: 'العنوان والوصف والتصنيف حقول مطلوبة'
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail: thumbnail || 'default-course.png',
      category,
      level: level || 'مبتدئ',
      duration,
      isPublished: Boolean(isPublished)
    });

    res.status(201).json({
      message: 'تم إنشاء الكورس بنجاح',
      course
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في إنشاء الكورس',
      error: error.message
    });
  }
};
const getLessonsByCourseForAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب دروس الكورس',
      error: error.message
    });
  }
};

const createLessonForCourseAdmin = async (req, res) => {
  try {
    const { title, content, videoUrl, order, resources, codeExamples } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    if (!title || !content || !order) {
      return res.status(400).json({
        message: 'عنوان الدرس والمحتوى والترتيب حقول مطلوبة'
      });
    }

    const existingLesson = await Lesson.findOne({
      course: course._id,
      order
    });

    if (existingLesson) {
      return res.status(400).json({
        message: 'يوجد درس بنفس الترتيب داخل هذا الكورس'
      });
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl: videoUrl || '',
      order,
      resources: Array.isArray(resources) ? resources : [],
      codeExamples: Array.isArray(codeExamples) ? codeExamples : [],
      course: course._id
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      message: 'تم إضافة الدرس بنجاح',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في إنشاء الدرس',
      error: error.message
    });
  }
};

const updateLessonAdmin = async (req, res) => {
  try {
    const { title, content, videoUrl, order, resources, codeExamples } = req.body;

    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }

    if (order && order !== lesson.order) {
      const existingLesson = await Lesson.findOne({
        course: lesson.course,
        order
      });

      if (existingLesson && existingLesson._id.toString() !== lesson._id.toString()) {
        return res.status(400).json({
          message: 'يوجد درس آخر بنفس الترتيب داخل هذا الكورس'
        });
      }
    }

    lesson.title = title ?? lesson.title;
    lesson.content = content ?? lesson.content;
    lesson.videoUrl = videoUrl ?? lesson.videoUrl;
    lesson.order = order ?? lesson.order;
    lesson.resources = Array.isArray(resources) ? resources : lesson.resources;
    lesson.codeExamples = Array.isArray(codeExamples) ? codeExamples : lesson.codeExamples;

    await lesson.save();

    res.status(200).json({
      message: 'تم تحديث الدرس بنجاح',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تحديث الدرس',
      error: error.message
    });
  }
};

const deleteLessonAdmin = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }

    await Course.findByIdAndUpdate(lesson.course, {
      $pull: { lessons: lesson._id }
    });

    await lesson.deleteOne();

    res.status(200).json({
      message: 'تم حذف الدرس بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في حذف الدرس',
      error: error.message
    });
  }
};
const updateCourseAdmin = async (req, res) => {
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

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.thumbnail = thumbnail ?? course.thumbnail;
    course.category = category ?? course.category;
    course.level = level ?? course.level;
    course.duration = duration ?? course.duration;

    if (typeof isPublished === 'boolean') {
      course.isPublished = isPublished;
    }

    await course.save();

    res.status(200).json({
      message: 'تم تحديث الكورس بنجاح',
      course
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تحديث الكورس',
      error: error.message
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    await Lesson.deleteMany({ course: course._id });
    await course.deleteOne();

    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    res.status(200).json({ message: 'تم حذف الكورس بنجاح' });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في حذف الكورس',
      error: error.message
    });
  }
};

const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      message: course.isPublished ? 'تم نشر الكورس بنجاح' : 'تم إخفاء الكورس بنجاح',
      course
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تغيير حالة نشر الكورس',
      error: error.message
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'الدور غير صالح'
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: 'تم تحديث صلاحية المستخدم بنجاح',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تحديث صلاحية المستخدم',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllCoursesForAdmin,
  createCourseAdmin,
  updateCourseAdmin,
  deleteCourse,
  togglePublishCourse,
  updateUserRole,
  getLessonsByCourseForAdmin,
  createLessonForCourseAdmin,
  updateLessonAdmin,
  deleteLessonAdmin
};