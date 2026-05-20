const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

const getQuizzesByCourseForAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    const quizzes = await Quiz.find({ course: req.params.courseId }).sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب الكويزات',
      error: error.message
    });
  }
};

const createQuizForCourseAdmin = async (req, res) => {
  try {
    const { title, description, isPublished, passingScore } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'الكورس غير موجود' });
    }

    if (!title) {
      return res.status(400).json({ message: 'عنوان الكويز مطلوب' });
    }

    const quiz = await Quiz.create({
      title,
      description: description || '',
      course: course._id,
      questions: [],
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      passingScore: passingScore || 60
    });

    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json({
      message: 'تم إنشاء الكويز بنجاح',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في إنشاء الكويز',
      error: error.message
    });
  }
};

const updateQuizAdmin = async (req, res) => {
  try {
    const { title, description, isPublished, passingScore } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    quiz.title = title ?? quiz.title;
    quiz.description = description ?? quiz.description;

    if (typeof isPublished === 'boolean') {
      quiz.isPublished = isPublished;
    }

    if (typeof passingScore === 'number') {
      quiz.passingScore = passingScore;
    }

    await quiz.save();

    res.status(200).json({
      message: 'تم تحديث الكويز بنجاح',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تحديث الكويز',
      error: error.message
    });
  }
};

const deleteQuizAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    await Course.findByIdAndUpdate(quiz.course, {
      $pull: { quizzes: quiz._id }
    });

    await quiz.deleteOne();

    res.status(200).json({
      message: 'تم حذف الكويز بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في حذف الكويز',
      error: error.message
    });
  }
};

const addQuestionToQuizAdmin = async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: 'بيانات السؤال غير صحيحة'
      });
    }

    if (
      typeof correctAnswer !== 'number' ||
      correctAnswer < 0 ||
      correctAnswer >= options.length
    ) {
      return res.status(400).json({
        message: 'الإجابة الصحيحة غير صحيحة'
      });
    }

    quiz.questions.push({
      question,
      options,
      correctAnswer,
      explanation: explanation || ''
    });

    await quiz.save();

    res.status(201).json({
      message: 'تمت إضافة السؤال بنجاح',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في إضافة السؤال',
      error: error.message
    });
  }
};

const updateQuestionAdmin = async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    const targetQuestion = quiz.questions.id(req.params.questionId);

    if (!targetQuestion) {
      return res.status(404).json({ message: 'السؤال غير موجود' });
    }

    if (options && (!Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({
        message: 'يجب أن يحتوي السؤال على خيارين على الأقل'
      });
    }

    const finalOptions = options ?? targetQuestion.options;
    const finalCorrectAnswer =
      typeof correctAnswer === 'number' ? correctAnswer : targetQuestion.correctAnswer;

    if (finalCorrectAnswer < 0 || finalCorrectAnswer >= finalOptions.length) {
      return res.status(400).json({
        message: 'الإجابة الصحيحة غير متوافقة مع عدد الاختيارات'
      });
    }

    targetQuestion.question = question ?? targetQuestion.question;
    targetQuestion.options = finalOptions;
    targetQuestion.correctAnswer = finalCorrectAnswer;
    targetQuestion.explanation = explanation ?? targetQuestion.explanation;

    await quiz.save();

    res.status(200).json({
      message: 'تم تحديث السؤال بنجاح',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تحديث السؤال',
      error: error.message
    });
  }
};

const deleteQuestionAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    const targetQuestion = quiz.questions.id(req.params.questionId);

    if (!targetQuestion) {
      return res.status(404).json({ message: 'السؤال غير موجود' });
    }

    targetQuestion.deleteOne();
    await quiz.save();

    res.status(200).json({
      message: 'تم حذف السؤال بنجاح',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في حذف السؤال',
      error: error.message
    });
  }
};

module.exports = {
  getQuizzesByCourseForAdmin,
  createQuizForCourseAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
  addQuestionToQuizAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin
};