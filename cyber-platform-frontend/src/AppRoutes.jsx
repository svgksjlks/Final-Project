import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Navbar from './Components/Navbar';
import MyCourses from './pages/MyCourses';
import QuizPage from './pages/QuizPage';

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/courses/:courseId/quiz" element={<QuizPage />} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;