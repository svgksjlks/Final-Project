import React, { useEffect, useState } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import {
  getCourseAPI,
  getCourseLessonsAPI,
  enrollCourseAPI,
  getProgressAPI,
  updateProgressAPI
}
 from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

import '../styles/courseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
  const fetchCourseDetails = async () => {
    try {
      const courseRes = await getCourseAPI(id);
      const lessonsRes = await getCourseLessonsAPI(id);

      setCourse(courseRes.data);
      setLessons(lessonsRes.data);

      const user = JSON.parse(localStorage.getItem('user'));

      if (user && user.enrolledCourses && user.enrolledCourses.includes(id)) {
        setIsEnrolled(true);
      }

      if (user) {
        const progressRes = await getProgressAPI(id);
        setProgress(progressRes.data);

        const completedIds = progressRes.data.completedLessons?.map(
          (lesson) => lesson._id || lesson
        ) || [];

        setCompletedLessons(completedIds.map((lessonId) => lessonId.toString()));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  fetchCourseDetails();
}, [id]);
     
    const handleMarkLessonComplete = async (lessonId) => {
  try {
    const res = await updateProgressAPI(id, lessonId);
    setProgress(res.data.progress);

    const updatedCompleted = res.data.progress.completedLessons.map((lesson) =>
      lesson._id ? lesson._id.toString() : lesson.toString()
    );

    setCompletedLessons(updatedCompleted);
  } catch (err) {
    console.error(err);
  }
};

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setEnrollMessage('');

    try {
      await enrollCourseAPI(id);
      setEnrollMessage('You have successfully enrolled in this course!');
      setIsEnrolled(true);

      // تحديث بيانات المستخدم في localStorage
      const updatedUser = { ...user };
      if (!updatedUser.enrolledCourses) {
        updatedUser.enrolledCourses = [];
      }
      updatedUser.enrolledCourses.push(id);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
     setEnrollMessage(getErrorMessage(err));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <h2 className="details-status">Loading course details...</h2>;
  if (error) return <h2 className="details-status error">{error}</h2>;
  if (!course) return <h2 className="details-status">Course not found</h2>;

  return (
    <div className="course-details-page">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-meta">
          <span><strong>Category:</strong> {course.category}</span>
          <span><strong>Level:</strong> {course.level}</span>
          <span><strong>Duration:</strong> {course.duration}</span>
        </div>

        <button
          className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
          onClick={handleEnroll}
          disabled={enrolling || isEnrolled}
        >
          {enrolling
            ? 'Enrolling...'
            : isEnrolled
            ? 'Already Enrolled ✓'
            : 'Enroll Now (Free)'}
        </button>

        {enrollMessage && <p className="enroll-message">{enrollMessage}</p>}

                          {isEnrolled && (
  <Link to={`/courses/${id}/quiz`} className="quiz-btn">
    ابدأ الاختبار
  </Link>
)}
      </div>

      <div className="lessons-section">
        <h2>Course Lessons</h2>

        {lessons.length === 0 ? (
          <p>No lessons available for this course.</p>
        ) : (
          lessons.map((lesson) => (
            <div className="lesson-card" key={lesson._id}>
  <h3>{lesson.order}. {lesson.title}</h3>
  <p>{lesson.content}</p>

  <button
    className={`complete-btn ${
      completedLessons.includes(lesson._id.toString()) ? 'completed' : ''
    }`}
    onClick={() => handleMarkLessonComplete(lesson._id)}
    disabled={completedLessons.includes(lesson._id.toString())}
  >
    {completedLessons.includes(lesson._id.toString())
      ? 'Completed ✓'
      : 'Mark as Completed'}
  </button>
</div>
          ))
        )}
      </div>
      {progress && (
  <div className="progress-box">
    <h3>Your Progress</h3>
    <p>{progress.progressPercentage}% completed</p>
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress.progressPercentage}%` }}
      ></div>
    </div>
  </div>
)}
    </div>
  );
};

export default CourseDetails;