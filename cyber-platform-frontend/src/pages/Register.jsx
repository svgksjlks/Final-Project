
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css';
import { useAuth } from '../context/AuthContext';
import getErrorMessage from '../utils/getErrorMessage';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await register(formData);
      setMessage('تم إنشاء الحساب بنجاح');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
  setError(getErrorMessage(err));
}
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>إنشاء حساب</h1>
        <p className="register-subtitle">انضم إلى منصة تعلم الأمن السيبراني</p>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="أدخل الاسم"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="أدخل البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="أدخل كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">إنشاء الحساب</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="register-footer">
          لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;