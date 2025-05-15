import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from '../api/axiosDefaults'; // ✅ Import shared axios instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
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
