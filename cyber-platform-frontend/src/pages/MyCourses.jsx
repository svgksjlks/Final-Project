import React, { useEffect, useState } from 'react';
import { getMyCoursesAPI, getProgressAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/myCourses.css';
import getErrorMessage from '../utils/getErrorMessage';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const res = await getMyCoursesAPI();
        const myCourses = res.data;
        setCourses(myCourses);

        const progressData = await Promise.all(
          myCourses.map(async (course) => {
            try {
              const progressRes = await getProgressAPI(course._id);
              return {
                ...course,
                progress: progressRes.data.progressPercentage || 0,
                isCompleted: progressRes.data.isCompleted || false
              };
            } catch (err) {
              return {
                ...course,
                progress: 0,
                isCompleted: false
              };
            }
          })
        );

        setCoursesWithProgress(progressData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) return <h2 className="my-courses-status">Loading your courses...</h2>;
  if (error) return <h2 className="my-courses-status error">{error}</h2>;

  return (
    <div className="my-courses-page">
      <h1 className="my-courses-title">My Courses</h1>

      {coursesWithProgress.length === 0 ? (
        <p className="my-courses-status">You have not enrolled in any courses yet.</p>
      ) : (
        <div className="my-courses-grid">
          {coursesWithProgress.map((course) => (
            <div className="my-course-card" key={course._id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Duration:</strong> {course.duration}</p>

              <div className="my-progress-box">
                <p>
                  <strong>Progress:</strong> {course.progress}%
                </p>

                <div className="my-progress-bar">
                  <div
                    className="my-progress-fill"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                <p className={course.isCompleted ? 'completed-text' : 'in-progress-text'}>
                  {course.isCompleted ? 'Completed ✅' : 'In Progress'}
                </p>
              </div>

              <Link to={`/courses/${course._id}`} className="my-course-btn">
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;