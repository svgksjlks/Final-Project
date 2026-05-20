import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getQuizByCourseAPI,
  submitQuizAPI,
  saveQuizScoreAPI
} from '../services/api';
import '../styles/quiz.css';
import getErrorMessage from '../utils/getErrorMessage';

const QuizPage = () => {
  const { courseId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await getQuizByCourseAPI(courseId);
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      } catch (err) {
       setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  const answeredCount = useMemo(() => {
    return answers.filter((answer) => answer !== null).length;
  }, [answers]);

  const progressPercentage = useMemo(() => {
    if (!quiz?.questions?.length) return 0;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  }, [answeredCount, quiz]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quiz) return;

    const hasEmptyAnswers = answers.some((answer) => answer === null);

    if (hasEmptyAnswers) {
      setError('من فضلك أجب على جميع الأسئلة قبل إرسال الاختبار');
      return;
    }

    setSubmitting(true);

    try {
      const res = await submitQuizAPI(quiz._id, { answers });
      setResult(res.data);

      await saveQuizScoreAPI(courseId, quiz._id, res.data.percentage);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (!quiz) return;
    setAnswers(new Array(quiz.questions.length).fill(null));
    setResult(null);
    setError('');
  };

  if (loading) return <h2 className="quiz-status">جاري تحميل الاختبار...</h2>;
  if (error && !quiz) return <h2 className="quiz-status error">{error}</h2>;
  if (!quiz) return <h2 className="quiz-status">الاختبار غير موجود</h2>;

  return (
    <div className="quiz-page">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1>{quiz.title}</h1>
          <p className="quiz-subtitle">
            أجب على جميع الأسئلة ثم اضغط على إرسال الاختبار
          </p>
        </div>

        {!result && (
          <div className="quiz-progress-box">
            <div className="quiz-progress-info">
              <span>عدد الإجابات: {answeredCount} / {quiz.questions.length}</span>
              <span>{progressPercentage}%</span>
            </div>

            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && <p className="quiz-error-message">{error}</p>}

        {result ? (
          <div className="quiz-result">
            <h2>نتيجة الاختبار</h2>

            <div className="quiz-result-grid">
              <div className="quiz-result-card">
                <h3>عدد الأسئلة</h3>
                <p>{result.totalQuestions}</p>
              </div>

              <div className="quiz-result-card">
                <h3>الإجابات الصحيحة</h3>
                <p>{result.correctAnswers}</p>
              </div>

              <div className="quiz-result-card">
                <h3>الإجابات الخاطئة</h3>
                <p>{result.wrongAnswers}</p>
              </div>

              <div className="quiz-result-card">
                <h3>النتيجة</h3>
                <p>{result.percentage}%</p>
              </div>
            </div>

            <div className={`quiz-final-status ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed
                ? `مبروك ✅ لقد اجتزت الاختبار بنجاح`
                : `للأسف ❌ لم تحقق نسبة النجاح المطلوبة (${result.passingScore}%)`}
            </div>

            <div className="quiz-actions">
              <button className="quiz-action-btn retry" onClick={handleRetry}>
                إعادة المحاولة
              </button>

              <Link to={`/courses/${courseId}`} className="quiz-action-btn back">
                العودة إلى الكورس
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {quiz.questions.map((question, questionIndex) => (
              <div className="quiz-question" key={questionIndex}>
                <h3>
                  {questionIndex + 1}. {question.questionText}
                </h3>

                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`quiz-option ${
                        answers[questionIndex] === optionIndex ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() => handleOptionChange(questionIndex, optionIndex)}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="submit-quiz-btn"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الاختبار'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuizPage;