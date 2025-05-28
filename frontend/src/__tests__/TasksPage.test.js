import React from 'react';
import { render, waitFor } from '@testing-library/react';
import TasksPage from '../pages/TasksPage';
import { AuthContext } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';


// ✅ Mock axios
jest.mock('../api/axiosDefaults', () => ({
  axiosInstance: {
    get: jest.fn().mockResolvedValue({ data: [] }), // Simulate empty task list
  },
}));

describe('TasksPage', () => {
  test('renders without crashing and displays no tasks', async () => {
    const mockUser = { username: 'testuser' };

    const { getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <TasksPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Wait for useEffect to run
    await waitFor(() => {
      expect(getByText(/No tasks found/i)).toBeInTheDocument();
    });
  });
});
