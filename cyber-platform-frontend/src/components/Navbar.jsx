import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">🔐 سايبر ليرن</Link>
        </div>

        {/* Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">الرئيسية</Link>

          {/* الدورات */}
          <div className="nav-dropdown">
            <div className="nav-dropdown-title">
              <span>الدورات</span>
              <FaChevronDown className="dropdown-icon" />
            </div>
            <div className="dropdown-menu">
              <Link to="/courses">كل الدورات</Link>
              {user && <Link to="/my-courses">كورساتي</Link>}
            </div>
          </div>

          {/* تعلم الآن */}
          <div className="nav-dropdown">
            <div className="nav-dropdown-title">
              <span>تعلم الآن</span>
              <FaChevronDown className="dropdown-icon" />
            </div>
            <div className="dropdown-menu">
              <Link to="/learn-now">نظرة عامة</Link>
              <Link to="/learn-now/articles">المقالات التعليمية</Link>
              <Link to="/courses">الدورات التعليمية</Link>
              <Link to="/learn-now/assignments">تكليفات الدورات</Link>
            </div>
          </div>

          {/* المسارات */}
          <div className="nav-dropdown">
  <div className="nav-dropdown-title">
    <span>المسارات</span>
    <FaChevronDown className="dropdown-icon" />
  </div>
  <div className="dropdown-menu">
    <Link to="/learning-paths">كل المسارات</Link>
    <Link to="/learning-paths/cyber-basics">أساسيات الأمن السيبراني</Link>
    <Link to="/learning-paths/red-team">Red Team</Link>
    <Link to="/learning-paths/blue-team">Blue Team</Link>
    <Link to="/learning-paths/soc">SOC</Link>
    <Link to="/learning-paths/pen-tester">Pen Tester</Link>
    <Link to="/learning-paths/network-security">Network Security</Link>
    <Link to="/learning-paths/forensics">Forensics</Link>
  </div>
</div>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">لوحة التحكم</Link>

              {user?.role === 'admin' && (
  <Link to="/admin" className="nav-link">لوحة الأدمن</Link>
)}

              <div className="navbar-user-box">
                <FaUserCircle className="user-icon" />
                <span className="navbar-user-name">{user.name}</span>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>تسجيل الخروج</span>
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">تسجيل الدخول</Link>
              <Link to="/register" className="register-btn">إنشاء حساب</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;