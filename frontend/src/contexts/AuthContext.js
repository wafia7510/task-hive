import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from '../api/axiosDefaults';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (formData) => {
    const response = await axiosInstance.post('/api/accounts/login/', {
      username: formData.username,
      password: formData.password,
    });

    const token = response.data.token;
    const userData = response.data.user || { username: formData.username };

    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const signup = async (formData) => {
    const response = await axiosInstance.post('/api/accounts/register/', {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

    return response.data;
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
