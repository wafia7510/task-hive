import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 📦 Page and Component Imports
import HomePage from './components/HomePage';
import Register from './pages/Signup';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './utils/PrivateRoute';
import TasksPage from './pages/TasksPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import ExploreProfilesPage from './pages/ExploreProfilesPage';
import Footer from './components/Footer';
import FeedPage from './pages/FeedPage';

function App() {
  return (
    // 🌐 Wrap entire app in Router for routing
    <Router>
      <div className="d-flex flex-column min-vh-100" aria-label="Main App Layout">
        <div className="flex-grow-1" aria-label="Page Content Container">
          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/" element={<HomePage />} aria-label="Home Page Route" />
            <Route path="/register" element={<Register />} aria-label="Signup Page Route" />
            <Route path="/login" element={<LoginPage />} aria-label="Login Page Route" />

            {/* 🔒 Protected Routes - Accessible only when logged in */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
              aria-label="Dashboard Page Route"
            />
            <Route
              path="/profiles/:username"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
              aria-label="User Profile Page Route"
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
              aria-label="Own Profile Page Route"
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksPage />
                </PrivateRoute>
              }
              aria-label="Tasks Page Route"
            />
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <NotesPage />
                </PrivateRoute>
              }
              aria-label="Notes Page Route"
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <ExploreProfilesPage />
                </PrivateRoute>
              }
              aria-label="Explore Profiles Page Route"
            />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <FeedPage />
                </PrivateRoute>
              }
              aria-label="Feed Page Route"
            />
          </Routes>
        </div>

        {/* 🔻 Global Footer always shown */}
        <Footer aria-label="Global Footer" />
      </div>
    </Router>
  );
}

export default App;
