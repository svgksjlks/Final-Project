import React, { useEffect, useState } from 'react';
import { getCoursesAPI } from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCoursesAPI();
        setCourses(res.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <h2 className="status-message">Loading courses...</h2>;
  if (error) return <h2 className="status-message error">{error}</h2>;

  return (
    <div className="courses-page">
      <h1 className="courses-title">Cyber Security Courses</h1>

      {courses.length === 0 ? (
        <p className="status-message">No courses found.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course._id}>
              <div className="course-card-content">
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
                <p><strong>Category:</strong> {course.category}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <p><strong>Duration:</strong> {course.duration}</p>

                <Link className="details-btn" to={`/courses/${course._id}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;