// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//         setLoading(false);
//     }, []);

//     const login = (userData) => {
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginAPI, registerAPI, getProfileAPI, googleLoginAPI } from '../services/api';






const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfileAPI();

        const updatedUser = {
          ...user,
          ...res.data
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('فشل تحميل بيانات المستخدم:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const login = async (formData) => {
    const res = await loginAPI(formData);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const register = async (formData) => {
    const res = await registerAPI(formData);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
const googleLogin = async (credential) => {
  const res = await googleLoginAPI(credential);
  setUser(res.data);
  localStorage.setItem('user', JSON.stringify(res.data));
  return res.data;
};
  return (
    
    <AuthContext.Provider
    
      value={{
        user,
    setUser,
    login,
    register,
    googleLogin,
    logout,
    loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



