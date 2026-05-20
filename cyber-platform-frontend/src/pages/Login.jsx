import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/login.css';
import { useAuth } from '../context/AuthContext';
import getErrorMessage from '../utils/getErrorMessage';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
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
      await login(formData);
      setMessage('تم تسجيل الدخول بنجاح');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
  setError(getErrorMessage(err));
}
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setMessage('');

      await googleLogin(credentialResponse.credential);
      setMessage('تم تسجيل الدخول بواسطة جوجل بنجاح');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول بواسطة جوجل');
    }
  };

  const handleGoogleError = () => {
    setError('حدث خطأ أثناء تسجيل الدخول بواسطة جوجل');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>تسجيل الدخول</h1>
        <p className="login-subtitle">ادخل إلى منصة تعلم الأمن السيبراني</p>

        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit">دخول</button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="login-footer">
          ليس لديك حساب؟ <Link to="/register">أنشئ حسابًا</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;