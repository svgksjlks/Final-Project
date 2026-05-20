import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import QuizPage from './pages/QuizPage';
import Dashboard from './pages/Dashboard';
import LearnNow from './pages/LearnNow';
import Articles from './pages/Articles';
import Assignments from './pages/Assignments';
import LearningPaths from './pages/LearningPaths';
import ProtectedRoute from './components/ProtectedRoute';
import LearningPathDetails from './pages/LearningPathDetails';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminLessons from './pages/AdminLessons';
import AdminQuizzes from './pages/AdminQuizzes';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route
  path="/admin/courses/:courseId/lessons"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminLessons />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/courses/:courseId/quizzes"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminQuizzes />
      </AdminRoute>
    </ProtectedRoute>
  }
/>

          <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
          <Route path="/learn-now" element={<LearnNow />} />
          <Route path="/learn-now/articles" element={<Articles />} />
          <Route path="/learn-now/assignments" element={<Assignments />} />
          <Route path="/learning-paths" element={<LearningPaths />} />
          <Route path="/learning-paths/:slug" element={<LearningPathDetails />} />
          
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;