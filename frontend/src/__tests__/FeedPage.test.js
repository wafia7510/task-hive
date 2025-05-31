// src/__tests__/FeedPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedPage from '../pages/FeedPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { axiosInstance } from '../api/axiosDefaults';

// ✅ Mock components
jest.mock('../components/NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Mock NavBar</div>,
}));

jest.mock('../components/CommentsModal', () => ({
  __esModule: true,
  default: () => <div data-testid="comments-modal">Mock CommentsModal</div>,
}));

jest.mock('../components/LikesButton', () => ({
  __esModule: true,
  default: () => <div data-testid="likes-button">Mock LikesButton</div>,
}));

// ✅ Mock notes data
const mockFeedNotes = [
  {
    id: 1,
    title: 'Shared Note 1',
    content: 'This is a test content for note 1. It should appear in the feed.',
    owner: 'testuser1',
    like_count: 3,
  },
  {
    id: 2,
    title: 'Shared Note 2',
    content: 'Another note with different text.',
    owner: 'testuser2',
    like_count: 5,
  },
];

// ✅ Mock axios GET with token
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => 'fake-token');

  jest.spyOn(axiosInstance, 'get').mockImplementation((url, config) => {
    if (url === '/notes/feed/' && config?.headers?.Authorization === 'Token fake-token') {
      return Promise.resolve({ data: mockFeedNotes });
    }
    return Promise.reject(new Error('Not Found'));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('FeedPage', () => {
  test('renders feed notes and filters with search', async () => {
    render(
      <Router>
        <AuthContext.Provider value={{ user: { username: 'tester' } }}>
          <FeedPage />
        </AuthContext.Provider>
      </Router>
    );

    // ✅ Wait for note titles to appear
    expect(await screen.findByText(/Shared Note 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Shared Note 2/i)).toBeInTheDocument();

    // ✅ Check that owners are rendered
    expect(screen.getByText(/by testuser1/i)).toBeInTheDocument();
    expect(screen.getByText(/by testuser2/i)).toBeInTheDocument();

    // ✅ Filter with search input
    fireEvent.change(screen.getByPlaceholderText(/search notes/i), {
      target: { value: 'Note 2' },
    });

    // ✅ Check that only matching note remains
    expect(screen.queryByText(/Shared Note 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Shared Note 2/i)).toBeInTheDocument();
  });
});
