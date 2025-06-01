import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../api/axiosDefaults';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ CSRF setup using safe GET route
  useEffect(() => {
    axiosInstance.get('/csrf/')
      .then(() => console.log("✅ CSRF token fetched successfully"))
      .catch((err) => console.warn("⚠️ CSRF token fetch failed:", err));
  }, []);

  // ✅ Login handler
  const login = async (formData) => {
    try {
      const response = await axiosInstance.post(
        '/dj-rest-auth/login/',
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
        }
      );

      const token = response.data.key;
      const userData = response.data.user || { username: formData.username };

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('username', userData.username);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response || error);
      return {
        success: false,
        message: error.response?.data?.non_field_errors?.[0] || 'Login failed',
      };
    }
  };

  // ✅ Signup handler
  const signup = async (formData) => {
    try {
      const response = await axiosInstance.post(
        '/accounts/register/',
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          username: formData.username,
          password1: formData.password,
          password2: formData.password,
        },
        {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup failed:', error.response || error);
      return {
        success: false,
        message: error.response?.data?.non_field_errors?.[0] || 'Signup failed',
      };
    }
  };

  // ✅ Logout
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
