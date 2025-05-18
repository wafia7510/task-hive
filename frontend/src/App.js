// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './pages/Signup';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
//import Tasks from './pages/Tasks'; // If exists
//import Notes from './pages/Notes'; // If exists
//import Profile from './pages/Profile'; // If exists
import PrivateRoute from './utils/PrivateRoute';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        {/*<Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />*/}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          }
        />
        {/*<Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />*/}
      </Routes>
    </Router>
  );
}

export default App;
