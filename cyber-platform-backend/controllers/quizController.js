const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');

    if (!quiz) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    if (!quiz.isPublished) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      course: quiz.course,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        explanation: q.explanation
      }))
    };

    res.status(200).json(safeQuiz);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب الكويز',
      error: error.message
    });
  }
};

const getQuizByCourse = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      course: req.params.courseId,
      isPublished: true
    }).populate('course', 'title');

    if (!quiz) {
      return res.status(404).json({ message: 'لا يوجد كويز لهذا الكورس' });
    }

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      course: quiz.course,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        explanation: q.explanation
      }))
    };

    res.status(200).json(safeQuiz);
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في جلب كويز الكورس',
      error: error.message
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ message: 'الكويز غير موجود' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'صيغة الإجابات غير صحيحة' });
    }

    let correctCount = 0;

    const results = quiz.questions.map((question, index) => {
      const selectedAnswer = answers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: question._id,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    res.status(200).json({
      message: 'تم تصحيح الكويز بنجاح',
      score,
      passed,
      correctCount,
      totalQuestions,
      results
    });
  } catch (error) {
    res.status(500).json({
      message: 'خطأ في تصحيح الكويز',
      error: error.message
    });
  }
};

module.exports = {
  getQuizById,
  getQuizByCourse,
  submitQuiz
};