import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCourseAPI,
  getAdminQuizzesByCourseAPI,
  createAdminQuizAPI,
  updateAdminQuizAPI,
  deleteAdminQuizAPI,
  addQuestionToQuizAPI,
  updateQuestionInQuizAPI,
  deleteQuestionFromQuizAPI
} from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const quizInitialState = {
  title: '',
  description: '',
  passingScore: 60,
  isPublished: true
};

const questionInitialState = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: ''
};

const AdminQuizzes = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const [quizForm, setQuizForm] = useState(quizInitialState);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState(questionInitialState);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, quizzesRes] = await Promise.all([
        getCourseAPI(courseId),
        getAdminQuizzesByCourseAPI(courseId)
      ]);

      setCourse(courseRes.data);
      setQuizzes(quizzesRes.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const resetQuizForm = () => {
    setQuizForm(quizInitialState);
    setEditingQuizId(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm(questionInitialState);
    setEditingQuestionId(null);
  };

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'passingScore' ? Number(value) : value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: name === 'correctAnswer' ? Number(value) : value
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingQuizId) {
        await updateAdminQuizAPI(editingQuizId, quizForm);
        setSuccess('تم تحديث الكويز بنجاح');
      } else {
        await createAdminQuizAPI(courseId, quizForm);
        setSuccess('تم إنشاء الكويز بنجاح');
      }

      resetQuizForm();
      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    if (!selectedQuizId) {
      setError('اختر كويز أولًا لإضافة سؤال');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const cleanedOptions = questionForm.options.map((op) => op.trim()).filter(Boolean);

      const payload = {
        ...questionForm,
        options: cleanedOptions
      };

      if (editingQuestionId) {
        await updateQuestionInQuizAPI(selectedQuizId, editingQuestionId, payload);
        setSuccess('تم تحديث السؤال بنجاح');
      } else {
        await addQuestionToQuizAPI(selectedQuizId, payload);
        setSuccess('تمت إضافة السؤال بنجاح');
      }

      resetQuestionForm();
      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      passingScore: quiz.passingScore || 60,
      isPublished: quiz.isPublished ?? true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('هل تريد حذف هذا الكويز؟')) return;

    setActionLoading(true);
    try {
      await deleteAdminQuizAPI(quizId);
      setSuccess('تم حذف الكويز بنجاح');

      if (selectedQuizId === quizId) {
        setSelectedQuizId(null);
        resetQuestionForm();
      }

      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    resetQuestionForm();
  };

  const handleEditQuestion = (quizId, question) => {
    setSelectedQuizId(quizId);
    setEditingQuestionId(question._id);
    setQuestionForm({
      question: question.question || '',
      options: [
        question.options?.[0] || '',
        question.options?.[1] || '',
        question.options?.[2] || '',
        question.options?.[3] || ''
      ],
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    if (!window.confirm('هل تريد حذف هذا السؤال؟')) return;

    setActionLoading(true);
    try {
      await deleteQuestionFromQuizAPI(quizId, questionId);
      setSuccess('تم حذف السؤال بنجاح');
      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '40px' }}>جاري تحميل الكويزات...</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>إدارة كويزات الكورس</h1>

      {course && (
        <div style={styles.courseBox}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      )}

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <section style={styles.section}>
        <h2>{editingQuizId ? 'تعديل كويز' : 'إنشاء كويز جديد'}</h2>
        <form onSubmit={handleQuizSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="عنوان الكويز"
            value={quizForm.title}
            onChange={handleQuizChange}
            style={styles.input}
            required
          />

          <textarea
            name="description"
            placeholder="وصف الكويز"
            value={quizForm.description}
            onChange={handleQuizChange}
            style={{ ...styles.input, minHeight: '100px' }}
          />

          <input
            type="number"
            name="passingScore"
            placeholder="درجة النجاح"
            value={quizForm.passingScore}
            onChange={handleQuizChange}
            style={styles.input}
            min="0"
            max="100"
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isPublished"
              checked={quizForm.isPublished}
              onChange={handleQuizChange}
            />
            <span>نشر الكويز</span>
          </label>

          <div style={styles.actionsRow}>
            <button type="submit" style={styles.primaryBtn} disabled={actionLoading}>
              {editingQuizId ? 'حفظ التعديلات' : 'إنشاء الكويز'}
            </button>

            {editingQuizId && (
              <button type="button" style={styles.secondaryBtn} onClick={resetQuizForm}>
                إلغاء
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={styles.section}>
        <h2>{editingQuestionId ? 'تعديل سؤال' : 'إضافة سؤال إلى كويز'}</h2>

        <div style={styles.helperBox}>
          الكويز المختار حاليًا:
          <strong style={{ marginRight: '8px' }}>
            {selectedQuizId
              ? quizzes.find((q) => q._id === selectedQuizId)?.title || 'تم الاختيار'
              : 'لم يتم اختيار كويز'}
          </strong>
        </div>

        <form onSubmit={handleQuestionSubmit} style={styles.form}>
          <textarea
            name="question"
            placeholder="نص السؤال"
            value={questionForm.question}
            onChange={handleQuestionChange}
            style={{ ...styles.input, minHeight: '100px' }}
            required
          />

          {questionForm.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`الخيار ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              style={styles.input}
            />
          ))}

          <input
            type="number"
            name="correctAnswer"
            placeholder="رقم الإجابة الصحيحة يبدأ من 0"
            value={questionForm.correctAnswer}
            onChange={handleQuestionChange}
            style={styles.input}
            min="0"
          />

          <textarea
            name="explanation"
            placeholder="شرح الإجابة الصحيحة (اختياري)"
            value={questionForm.explanation}
            onChange={handleQuestionChange}
            style={{ ...styles.input, minHeight: '100px' }}
          />

          <div style={styles.actionsRow}>
            <button type="submit" style={styles.primaryBtn} disabled={actionLoading}>
              {editingQuestionId ? 'حفظ تعديل السؤال' : 'إضافة السؤال'}
            </button>

            {editingQuestionId && (
              <button type="button" style={styles.secondaryBtn} onClick={resetQuestionForm}>
                إلغاء
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={styles.section}>
        <h2>الكويزات الحالية</h2>

        {quizzes.length === 0 ? (
          <p>لا توجد كويزات لهذا الكورس.</p>
        ) : (
          <div style={styles.quizList}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} style={styles.quizCard}>
                <div style={styles.quizTop}>
                  <div>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                  </div>

                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: quiz.isPublished ? '#16a34a' : '#6b7280'
                    }}
                  >
                    {quiz.isPublished ? 'منشور' : 'مخفي'}
                  </span>
                </div>

                <div style={styles.metaRow}>
                  <span><strong>درجة النجاح:</strong> {quiz.passingScore}%</span>
                  <span><strong>عدد الأسئلة:</strong> {quiz.questions?.length || 0}</span>
                </div>

                <div style={styles.actionsRow}>
                  <button
                    style={styles.primaryBtn}
                    onClick={() => handleEditQuiz(quiz)}
                    disabled={actionLoading}
                  >
                    تعديل الكويز
                  </button>

                  <button
                    style={styles.secondaryBtn}
                    onClick={() => handleSelectQuiz(quiz._id)}
                    disabled={actionLoading}
                  >
                    اختيار لإضافة سؤال
                  </button>

                  <button
                    style={styles.dangerBtn}
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    disabled={actionLoading}
                  >
                    حذف الكويز
                  </button>
                </div>

                {quiz.questions?.length > 0 && (
                  <div style={styles.questionsBox}>
                    <h4>الأسئلة</h4>
                    {quiz.questions.map((questionItem, idx) => (
                      <div key={questionItem._id} style={styles.questionCard}>
                        <p><strong>س{idx + 1}:</strong> {questionItem.question}</p>

                        <ul style={styles.optionsList}>
                          {questionItem.options.map((op, opIndex) => (
                            <li key={opIndex}>
                              {opIndex}. {op}
                              {questionItem.correctAnswer === opIndex && ' ✅'}
                            </li>
                          ))}
                        </ul>

                        {questionItem.explanation && (
                          <p style={{ color: '#555' }}>
                            <strong>الشرح:</strong> {questionItem.explanation}
                          </p>
                        )}

                        <div style={styles.actionsRow}>
                          <button
                            style={styles.primaryBtn}
                            onClick={() => handleEditQuestion(quiz._id, questionItem)}
                            disabled={actionLoading}
                          >
                            تعديل السؤال
                          </button>

                          <button
                            style={styles.dangerBtn}
                            onClick={() => handleDeleteQuestion(quiz._id, questionItem._id)}
                            disabled={actionLoading}
                          >
                            حذف السؤال
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px 60px',
    direction: 'rtl'
  },
  title: {
    marginBottom: '20px'
  },
  courseBox: {
    background: '#fff',
    padding: '20px',
    borderRadius: '14px',
    marginBottom: '20px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
  },
  section: {
    background: '#fff',
    padding: '20px',
    borderRadius: '14px',
    marginBottom: '20px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
  },
  form: {
    display: 'grid',
    gap: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '15px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  actionsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  secondaryBtn: {
    background: '#e5e7eb',
    color: '#111',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  dangerBtn: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  quizList: {
    display: 'grid',
    gap: '16px'
  },
  quizCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px'
  },
  quizTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '10px'
  },
  badge: {
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '15px',
    color: '#444'
  },
  questionsBox: {
    marginTop: '18px',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  questionCard: {
    background: '#f9fafb',
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '12px'
  },
  optionsList: {
    paddingRight: '20px',
    lineHeight: '1.8'
  },
  helperBox: {
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  errorBox: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  successBox: {
    background: '#dcfce7',
    color: '#166534',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '15px'
  }
};

export default AdminQuizzes;