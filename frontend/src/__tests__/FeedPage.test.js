// ✅ Mock axios first
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

// ✅ Inline mocks directly inside jest.mock()
jest.mock('../components/NavBar', () => ({
  __esModule: true,
  default: () => {
    const MockNavBar = () => <div data-testid="navbar">Mock NavBar</div>;
    MockNavBar.displayName = 'MockNavBar';
    return <MockNavBar />;
  },
}));

jest.mock('../components/CommentsModal', () => ({
  __esModule: true,
  default: () => {
    const MockCommentsModal = () => <div data-testid="comments-modal">Mock CommentsModal</div>;
    MockCommentsModal.displayName = 'MockCommentsModal';
    return <MockCommentsModal />;
  },
}));

jest.mock('../components/LikesButton', () => ({
  __esModule: true,
  default: () => {
    const MockLikesButton = () => <div data-testid="likes-button">Mock LikesButton</div>;
    MockLikesButton.displayName = 'MockLikesButton';
    return <MockLikesButton />;
  },
}));

// ✅ Imports after mocks
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FeedPage from '../pages/FeedPage';
import { AuthContext } from '../contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';

// ✅ Dummy feed notes
const mockFeedNotes = [
  {
    id: 1,
    title: 'Shared Note 1',
    content: 'Content from friend 1',
    owner: 'friend1',
    like_count: 3,
  },
  {
    id: 2,
    title: 'Shared Note 2',
    content: 'Content from friend 2',
    owner: 'friend2',
    like_count: 5,
  },
];

describe('FeedPage', () => {
  beforeEach(() => {
    axiosInstance.get = jest.fn((url) => {
      if (url === '/api/notes/feed/') {
        return Promise.resolve({ data: mockFeedNotes });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders feed notes and filters with search bar', async () => {
    render(
      <Router>
        <AuthContext.Provider value={{ user: { username: 'testuser' } }}>
          <FeedPage />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/shared note 1/i)).toBeInTheDocument();
      expect(screen.getByText(/shared note 2/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search notes/i), {
      target: { value: 'note 2' },
    });

    expect(screen.queryByText(/shared note 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/shared note 2/i)).toBeInTheDocument();
  });
});
