import React, { useEffect, useMemo, useState } from 'react';
import { getMyCoursesAPI, getProgressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const coursesRes = await getMyCoursesAPI();
        const myCourses = coursesRes.data || [];
        setCourses(myCourses);

        const progressResults = await Promise.all(
          myCourses.map(async (course) => {
            try {
              const progressRes = await getProgressAPI(course._id);
              return {
                courseId: course._id,
                courseTitle: course.title,
                courseDescription: course.description,
                category: course.category,
                level: course.level,
                duration: course.duration,
                progressPercentage: progressRes.data.progressPercentage || 0,
                isCompleted: progressRes.data.isCompleted || false,
                completedLessonsCount: progressRes.data.completedLessons?.length || 0,
                solvedQuizzesCount: progressRes.data.quizScores?.length || 0
              };
            } catch (error) {
              return {
                courseId: course._id,
                courseTitle: course.title,
                courseDescription: course.description,
                category: course.category,
                level: course.level,
                duration: course.duration,
                progressPercentage: 0,
                isCompleted: false,
                completedLessonsCount: 0,
                solvedQuizzesCount: 0
              };
            }
          })
        );

        setProgressData(progressResults);
      } catch (err) {
        setError('فشل تحميل بيانات لوحة التحكم');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalCourses = progressData.length;

  const totalSolvedQuizzes = useMemo(() => {
    return progressData.reduce((sum, item) => sum + item.solvedQuizzesCount, 0);
  }, [progressData]);

  const completedCourses = useMemo(() => {
    return progressData.filter((item) => item.isCompleted).length;
  }, [progressData]);

  const averageProgress = useMemo(() => {
    if (progressData.length === 0) return 0;

    const total = progressData.reduce(
      (sum, item) => sum + item.progressPercentage,
      0
    );

    return Math.round(total / progressData.length);
  }, [progressData]);

  const continueCourse = useMemo(() => {
    return progressData.find(
      (course) => course.progressPercentage > 0 && course.progressPercentage < 100
    );
  }, [progressData]);

  const latestStartedCourse = useMemo(() => {
    if (progressData.length === 0) return null;
    return progressData.find((course) => course.progressPercentage > 0) || progressData[0];
  }, [progressData]);

  if (loading) {
    return <h2 className="dashboard-status">جاري تحميل لوحة التحكم...</h2>;
  }

  if (error) {
    return <h2 className="dashboard-status error">{error}</h2>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome-card">
          <h1>لوحة التحكم</h1>
          <h2>مرحبًا، {user?.name}</h2>
          <p>
            تابع تقدمك، أكمل الدورات، وراجع نتائجك التعليمية من مكان واحد.
          </p>
        </div>

        <div className="dashboard-quick-actions">
          <h3>إجراءات سريعة</h3>
          <div className="quick-actions-grid">
            <Link to="/courses" className="quick-action-btn">
              استكشاف الدورات
            </Link>
            <Link to="/my-courses" className="quick-action-btn">
              كورساتي
            </Link>
            <Link to="/learn-now" className="quick-action-btn">
              تعلم الآن
            </Link>
            <Link to="/learning-paths" className="quick-action-btn">
              المسارات
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <h3>الكورسات المسجل فيها</h3>
          <p>{totalCourses}</p>
        </div>

        <div className="dashboard-stat-card">
          <h3>الكورسات المكتملة</h3>
          <p>{completedCourses}</p>
        </div>

        <div className="dashboard-stat-card">
          <h3>الكويزات المحلولة</h3>
          <p>{totalSolvedQuizzes}</p>
        </div>

        <div className="dashboard-stat-card">
          <h3>متوسط التقدم</h3>
          <p>{averageProgress}%</p>
        </div>
      </div>

      {continueCourse && (
        <div className="dashboard-highlight-card">
          <div>
            <h2>استكمل من حيث توقفت</h2>
            <p className="highlight-course-title">{continueCourse.courseTitle}</p>
            <p>نسبة التقدم الحالية: {continueCourse.progressPercentage}%</p>
          </div>

          <Link
            to={`/courses/${continueCourse.courseId}`}
            className="dashboard-btn dashboard-btn-primary"
          >
            استكمال الآن
          </Link>
        </div>
      )}

      {latestStartedCourse && (
        <div className="dashboard-section">
          <h2>آخر كورس تم البدء فيه</h2>
          <div className="dashboard-latest-card">
            <h3>{latestStartedCourse.courseTitle}</h3>
            <p>{latestStartedCourse.courseDescription}</p>

            <div className="latest-course-meta">
              <span><strong>التصنيف:</strong> {latestStartedCourse.category}</span>
              <span><strong>المستوى:</strong> {latestStartedCourse.level}</span>
              <span><strong>المدة:</strong> {latestStartedCourse.duration || 'غير محددة'}</span>
            </div>

            <Link
              to={`/courses/${latestStartedCourse.courseId}`}
              className="dashboard-btn"
            >
              عرض الكورس
            </Link>
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <h2>تقدمي في الكورسات</h2>

        {progressData.length === 0 ? (
          <div className="dashboard-empty-box">
            <p>لم تقم بالتسجيل في أي كورسات حتى الآن.</p>
            <Link to="/courses" className="dashboard-btn dashboard-btn-primary">
              ابدأ الآن
            </Link>
          </div>
        ) : (
          <div className="dashboard-courses-grid">
            {progressData.map((item) => (
              <div className="dashboard-course-card" key={item.courseId}>
                <div className="dashboard-course-top">
                  <h3>{item.courseTitle}</h3>
                  <span className={`course-status-badge ${item.isCompleted ? 'completed' : 'progress'}`}>
                    {item.isCompleted ? 'مكتمل' : 'قيد التعلم'}
                  </span>
                </div>

                <p className="dashboard-course-description">
                  {item.courseDescription}
                </p>

                <div className="dashboard-course-meta">
                  <span><strong>التصنيف:</strong> {item.category}</span>
                  <span><strong>المستوى:</strong> {item.level}</span>
                  <span><strong>المدة:</strong> {item.duration || 'غير محددة'}</span>
                </div>

                <div className="dashboard-progress-info">
                  <p><strong>نسبة التقدم:</strong> {item.progressPercentage}%</p>
                  <p><strong>الدروس المكتملة:</strong> {item.completedLessonsCount}</p>
                  <p><strong>الكويزات المحلولة:</strong> {item.solvedQuizzesCount}</p>
                </div>

                <div className="dashboard-progress-bar">
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: `${item.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="dashboard-course-actions">
                  <Link to={`/courses/${item.courseId}`} className="dashboard-btn">
                    متابعة الكورس
                  </Link>
                  <Link to={`/courses/${item.courseId}/quiz`} className="dashboard-btn dashboard-btn-secondary">
                    الاختبار
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;