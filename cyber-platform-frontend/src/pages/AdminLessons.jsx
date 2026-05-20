import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCourseAPI,
  getAdminCourseLessonsAPI,
  createAdminLessonAPI,
  updateAdminLessonAPI,
  deleteAdminLessonAPI
} from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const initialForm = {
  title: '',
  content: '',
  videoUrl: '',
  order: 1
};

const AdminLessons = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [courseRes, lessonsRes] = await Promise.all([
        getCourseAPI(courseId),
        getAdminCourseLessonsAPI(courseId)
      ]);

      setCourse(courseRes.data);
      setLessons(lessonsRes.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      videoUrl: '',
      order: lessons.length + 1 || 1
    });
    setEditingLessonId(null);
  };

  useEffect(() => {
    if (!editingLessonId) {
      setFormData((prev) => ({
        ...prev,
        order: lessons.length + 1 || 1
      }));
    }
  }, [lessons, editingLessonId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingLessonId) {
        await updateAdminLessonAPI(editingLessonId, formData);
        setSuccess('تم تحديث الدرس بنجاح');
      } else {
        await createAdminLessonAPI(courseId, formData);
        setSuccess('تم إنشاء الدرس بنجاح');
      }

      resetForm();
      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLessonId(lesson._id);
    setFormData({
      title: lesson.title || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      order: lesson.order || 1
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا الدرس؟');
    if (!confirmed) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteAdminLessonAPI(lessonId);
      setSuccess('تم حذف الدرس بنجاح');
      await fetchData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '40px' }}>جاري تحميل الدروس...</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>إدارة دروس الكورس</h1>

      {course && (
        <div style={styles.courseBox}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <div style={styles.metaRow}>
            <span><strong>التصنيف:</strong> {course.category}</span>
            <span><strong>المستوى:</strong> {course.level}</span>
            <span><strong>الحالة:</strong> {course.isPublished ? 'منشور' : 'مخفي'}</span>
          </div>
        </div>
      )}

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <section style={styles.section}>
        <h2>{editingLessonId ? 'تعديل درس' : 'إضافة درس جديد'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="عنوان الدرس"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <textarea
            name="content"
            placeholder="محتوى الدرس"
            value={formData.content}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: '180px' }}
            required
          />

          <input
            type="text"
            name="videoUrl"
            placeholder="رابط فيديو اختياري"
            value={formData.videoUrl}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="order"
            placeholder="ترتيب الدرس"
            value={formData.order}
            onChange={handleChange}
            style={styles.input}
            min="1"
            required
          />

          <div style={styles.actionsRow}>
            <button type="submit" style={styles.primaryBtn} disabled={actionLoading}>
              {editingLessonId ? 'حفظ التعديلات' : 'إضافة الدرس'}
            </button>

            {editingLessonId && (
              <button type="button" style={styles.secondaryBtn} onClick={resetForm}>
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={styles.section}>
        <h2>الدروس الحالية</h2>

        {lessons.length === 0 ? (
          <p>لا توجد دروس لهذا الكورس حتى الآن.</p>
        ) : (
          <div style={styles.lessonList}>
            {lessons.map((lesson) => (
              <div key={lesson._id} style={styles.lessonCard}>
                <div style={styles.lessonHeader}>
                  <div>
                    <h3 style={{ marginBottom: '8px' }}>
                      {lesson.order}. {lesson.title}
                    </h3>
                    <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-wrap' }}>
                      {lesson.content.length > 250
                        ? `${lesson.content.slice(0, 250)}...`
                        : lesson.content}
                    </p>
                  </div>

                  <span style={styles.orderBadge}>ترتيب: {lesson.order}</span>
                </div>

                <div style={styles.lessonActions}>
                  <button
                    style={styles.primaryBtn}
                    onClick={() => handleEdit(lesson)}
                    disabled={actionLoading}
                  >
                    تعديل
                  </button>

                  <button
                    style={styles.dangerBtn}
                    onClick={() => handleDelete(lesson._id)}
                    disabled={actionLoading}
                  >
                    حذف
                  </button>
                </div>
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
    maxWidth: '1100px',
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
  metaRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    color: '#444'
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
  actionsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  lessonList: {
    display: 'grid',
    gap: '15px'
  },
  lessonCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px'
  },
  lessonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '15px'
  },
  orderBadge: {
    background: '#111827',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  lessonActions: {
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

export default AdminLessons;