import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage';
import { AuthContext } from '../contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';

jest.mock('../api/axiosDefaults');

describe('DashboardPage', () => {
  const mockUser = { username: 'testuser' };

  const mockTasks = [
    { id: 1, title: 'Task One', status: 'Pending', priority: 'High' },
    { id: 2, title: 'Task Two', status: 'Completed', priority: 'Medium' },
    { id: 3, title: 'Task Three', status: 'In Progress', priority: 'Low' },
  ];

  const mockNotes = [
    { id: 1, title: 'Note One', content: 'Content of note one' },
    { id: 2, title: 'Note Two', content: 'Content of note two' },
  ];

  const mockFeedNotes = [
    { id: 1, title: 'Public Note', content: 'Feed note content', owner: 'friend1' },
  ];

  beforeEach(() => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === '/api/tasks/') {
        return Promise.resolve({ data: mockTasks });
      } else if (url === '/api/notes/') {
        return Promise.resolve({ data: mockNotes });
      } else if (url === '/api/notes/feed/') {
        return Promise.resolve({ data: mockFeedNotes });
      } else {
        return Promise.reject(new Error('Unknown endpoint'));
      }
    });
  });

  it('renders dashboard data correctly after loading', async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Router>
          <DashboardPage />
        </Router>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/welcome back, testuser/i)).toBeInTheDocument();
    });

    // ✅ Check Task titles
    expect(screen.getByText(/task one/i)).toBeInTheDocument();
    expect(screen.getByText(/task two/i)).toBeInTheDocument();
    expect(screen.getByText(/task three/i)).toBeInTheDocument();

    // ✅ Check Note titles (within each card to avoid multiple matches)
    const noteCards = screen.getAllByRole('link', { name: /view note/i });
    const firstNoteCard = within(noteCards[0]);
    expect(firstNoteCard.getByText((_, el) =>
    el?.tagName === 'DIV' && el.textContent === 'Note One'
    )).toBeInTheDocument();

    const secondNoteCard = within(noteCards[1]);
    expect(secondNoteCard.getByText((_, el) =>
    el?.tagName === 'DIV' && el.textContent === 'Note Two'
    )).toBeInTheDocument();


    // ✅ Check Feed
    expect(screen.getByText(/public note/i)).toBeInTheDocument();
    expect(screen.getByText(/feed – notes from your network/i)).toBeInTheDocument();
  });
});
