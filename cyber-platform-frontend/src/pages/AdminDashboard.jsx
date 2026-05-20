import React, { useEffect, useState } from 'react';
import {
  getAdminStatsAPI,
  getAdminUsersAPI,
  updateUserRoleAPI,
  getAdminCoursesAPI,
  createAdminCourseAPI,
  updateAdminCourseAPI,
  deleteAdminCourseAPI,
  togglePublishCourseAPI
} from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';
import { Link } from 'react-router-dom';

const initialForm = {
  title: '',
  description: '',
  thumbnail: '',
  category: 'مقدمة في الأمن السيبراني',
  level: 'مبتدئ',
  duration: '',
  isPublished: false
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState(initialForm);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, usersRes, coursesRes] = await Promise.all([
        getAdminStatsAPI(),
        getAdminUsersAPI(),
        getAdminCoursesAPI()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingCourseId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingCourseId) {
        await updateAdminCourseAPI(editingCourseId, formData);
        setSuccess('تم تحديث الكورس بنجاح');
      } else {
        await createAdminCourseAPI(formData);
        setSuccess('تم إنشاء الكورس بنجاح');
      }

      resetForm();
      await fetchAllData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      thumbnail: course.thumbnail || '',
      category: course.category || 'مقدمة في الأمن السيبراني',
      level: course.level || 'مبتدئ',
      duration: course.duration || '',
      isPublished: course.isPublished || false
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm('هل أنت متأكد من حذف الكورس؟ سيتم حذف الدروس المرتبطة به أيضًا.');
    if (!confirmDelete) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await deleteAdminCourseAPI(id);
      setSuccess('تم حذف الكورس بنجاح');
      await fetchAllData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await togglePublishCourseAPI(id);
      setSuccess(res.data.message || 'تم تحديث حالة النشر');
      await fetchAllData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeUserRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    const confirmChange = window.confirm(
      `هل تريد تغيير صلاحية المستخدم إلى ${newRole === 'admin' ? 'admin' : 'student'}؟`
    );

    if (!confirmChange) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateUserRoleAPI(id, newRole);
      setSuccess(res.data.message || 'تم تحديث الصلاحية');
      await fetchAllData();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '40px' }}>جاري تحميل لوحة تحكم الأدمن...</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>لوحة تحكم الأدمن</h1>
      <p style={styles.subtitle}>إدارة الكورسات والمستخدمين ومتابعة إحصائيات المنصة</p>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>عدد المستخدمين</h3>
          <p>{stats?.usersCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>عدد الكورسات</h3>
          <p>{stats?.coursesCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>الكورسات المنشورة</h3>
          <p>{stats?.publishedCoursesCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>عدد الدروس</h3>
          <p>{stats?.lessonsCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>إجمالي التسجيلات</h3>
          <p>{stats?.totalEnrollments || 0}</p>
        </div>
      </div>

      {/* Course Form */}
      <section style={styles.section}>
        <h2>{editingCourseId ? 'تعديل كورس' : 'إنشاء كورس جديد'}</h2>

        <form onSubmit={handleCreateOrUpdateCourse} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="عنوان الكورس"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <textarea
            name="description"
            placeholder="وصف الكورس"
            value={formData.description}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: '120px' }}
            required
          />

          <input
            type="text"
            name="thumbnail"
            placeholder="رابط الصورة المصغرة thumbnail (اختياري)"
            value={formData.thumbnail}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="مقدمة في الأمن السيبراني">مقدمة في الأمن السيبراني</option>
            <option value="أساسيات الشبكات">أساسيات الشبكات</option>
            <option value="أساسيات أنظمة التشغيل">أساسيات أنظمة التشغيل</option>
            <option value="أمن المعلومات">أمن المعلومات</option>
            <option value="الهجمات السيبرانية">الهجمات السيبرانية</option>
            <option value="الاختراق الأخلاقي">الاختراق الأخلاقي</option>
          </select>

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>

          <input
            type="text"
            name="duration"
            placeholder="مدة الكورس مثال: 5 ساعات"
            value={formData.duration}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <span>نشر الكورس مباشرة</span>
          </label>

          <div style={styles.formActions}>
            <button type="submit" style={styles.primaryBtn} disabled={actionLoading}>
              {editingCourseId ? 'حفظ التعديلات' : 'إنشاء الكورس'}
            </button>

            {editingCourseId && (
              <button type="button" style={styles.secondaryBtn} onClick={resetForm}>
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Courses */}
      <section style={styles.section}>
        <h2>إدارة الكورسات</h2>

        {courses.length === 0 ? (
          <p>لا توجد كورسات حتى الآن.</p>
        ) : (
          <div style={styles.cardList}>
            {courses.map((course) => (
              <div key={course._id} style={styles.courseCard}>
                <div style={styles.courseTop}>
                  <div>
                    <h3 style={{ marginBottom: '8px' }}>{course.title}</h3>
                    <p style={{ margin: 0, color: '#555' }}>{course.description}</p>
                  </div>

                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: course.isPublished ? '#16a34a' : '#6b7280'
                    }}
                  >
                    {course.isPublished ? 'منشور' : 'مخفي'}
                  </span>
                </div>

                <div style={styles.metaRow}>
                  <span><strong>التصنيف:</strong> {course.category}</span>
                  <span><strong>المستوى:</strong> {course.level}</span>
                  <span><strong>المدة:</strong> {course.duration || 'غير محددة'}</span>
                  <span><strong>الدروس:</strong> {course.lessons?.length || 0}</span>
                  <span><strong>المسجلون:</strong> {course.studentsEnrolled || 0}</span>
                </div>

                <div style={styles.actionsRow}>
  <button
    style={styles.primaryBtn}
    onClick={() => handleEditCourse(course)}
    disabled={actionLoading}
  >
    تعديل
  </button>
                    <Link
  to={`/admin/courses/${course._id}/quizzes`}
  style={{
    ...styles.secondaryBtn,
    textDecoration: 'none',
    display: 'inline-block'
  }}
>
  إدارة الكويزات
</Link>
  <Link
    to={`/admin/courses/${course._id}/lessons`}
    style={{
      ...styles.secondaryBtn,
      textDecoration: 'none',
      display: 'inline-block'
    }}
  >
    إدارة الدروس
  </Link>

  <button
    style={styles.secondaryBtn}
    onClick={() => handleTogglePublish(course._id)}
    disabled={actionLoading}
  >
    {course.isPublished ? 'إخفاء' : 'نشر'}
  </button>

  <button
    style={styles.dangerBtn}
    onClick={() => handleDeleteCourse(course._id)}
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

      {/* Users */}
      <section style={styles.section}>
        <h2>إدارة المستخدمين</h2>

        {users.length === 0 ? (
          <p>لا يوجد مستخدمون.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>الاسم</th>
                  <th style={styles.th}>البريد الإلكتروني</th>
                  <th style={styles.th}>الدور</th>
                  <th style={styles.th}>الكورسات المسجل بها</th>
                  <th style={styles.th}>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.role}</td>
                    <td style={styles.td}>{user.enrolledCourses?.length || 0}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.secondaryBtn}
                        onClick={() => handleChangeUserRole(user._id, user.role)}
                        disabled={actionLoading}
                      >
                        تحويل إلى {user.role === 'admin' ? 'student' : 'admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    marginBottom: '10px',
    fontSize: '32px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '25px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  statCard: {
    background: '#111827',
    color: '#fff',
    padding: '20px',
    borderRadius: '14px',
    textAlign: 'center'
  },
  section: {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  form: {
    display: 'grid',
    gap: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '15px',
    width: '100%'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  formActions: {
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
  cardList: {
    display: 'grid',
    gap: '15px'
  },
  courseCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px'
  },
  courseTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'flex-start',
    marginBottom: '15px'
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
  actionsRow: {
    


    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'right',
    borderBottom: '1px solid #ddd',
    padding: '12px',
    background: '#f9fafb'
  },
  td: {
    textAlign: 'right',
    borderBottom: '1px solid #eee',
    padding: '12px'
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

export default AdminDashboard;