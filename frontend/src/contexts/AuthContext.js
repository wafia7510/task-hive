// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosDefaults';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Fetch CSRF token once on load
  useEffect(() => {
    axiosInstance.get('/api/dj-rest-auth/csrf/').catch((err) => {
      console.warn('CSRF fetch failed:', err);
    });
  }, []);

  const login = async (formData) => {
    try {
      const response = await axiosInstance.post('/api/accounts/login/', {
        username: formData.username,
        password: formData.password,
      });

      const token = response.data.key;
      const userData = response.data.user || { username: formData.username };

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('username', userData.username);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response || error);
      return { success: false, message: error.response?.data || 'Login failed' };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await axiosInstance.post('/api/accounts/register/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password1: formData.password,
        password2: formData.password,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup failed:', error.response || error);
      return { success: false, message: error.response?.data || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
