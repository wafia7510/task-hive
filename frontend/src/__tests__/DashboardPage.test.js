// ✅ Mock axios
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
  }),
}));

// ✅ Mock NavBar
jest.mock('../components/NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Mock NavBar</div>,
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { AuthContext } from '../contexts/AuthContext';
import { axiosInstance } from '../api/axiosDefaults';

describe('DashboardPage', () => {
  const mockUser = { username: 'testuser' };

  const mockTasks = [{ id: 1, title: 'Test Task', status: 'todo', priority: 'medium' }];
  const mockNotes = [{ id: 1, title: 'Test Note', content: 'This is a test note.' }];
  const mockFeed = [{ id: 1, title: 'Feed Note', content: 'Feed content', owner: 'friend1' }];

  beforeEach(() => {
    // ✅ Mock all 3 dashboard API calls
    axiosInstance.get = jest.fn((url) => {
      if (url === '/tasks/') return Promise.resolve({ data: mockTasks });
      if (url === '/notes/') return Promise.resolve({ data: mockNotes });
      if (url === '/notes/feed/') return Promise.resolve({ data: mockFeed });
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard data correctly after loading', async () => {
    render(
      <Router>
        <AuthContext.Provider value={{ user: mockUser }}>
          <DashboardPage />
        </AuthContext.Provider>
      </Router>
    );

    // ✅ Expect greeting to appear
    await waitFor(() =>
      expect(screen.getByText(/welcome back, testuser/i)).toBeInTheDocument()
    );

    // ✅ Check task, note, and feed content
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Feed Note')).toBeInTheDocument();
  });
});
