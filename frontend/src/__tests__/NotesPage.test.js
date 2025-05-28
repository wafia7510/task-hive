// ✅ Mock axios first
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

// ✅ Inline component mocks inside jest.mock to avoid hoisting issues
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

jest.mock('../components/ManageTagsModal', () => ({
  __esModule: true,
  default: () => {
    const MockManageTagsModal = () => <div data-testid="manage-tags">Mock ManageTagsModal</div>;
    MockManageTagsModal.displayName = 'MockManageTagsModal';
    return <MockManageTagsModal />;
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
import { render, screen, waitFor } from '@testing-library/react';
import NotesPage from '../pages/NotesPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { axiosInstance } from '../api/axiosDefaults';

describe('NotesPage', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'mock-token');

    axiosInstance.get = jest.fn((url) => {
      if (url.includes('/notes/')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: 'Mock Note',
              content: 'Mock content here.',
              tags: ['tag1'],
              updated_at: new Date(),
              created_at: new Date(),
              like_count: 2,
            },
          ],
        });
      }

      if (url.includes('/tags/')) {
        return Promise.resolve({
          data: [{ name: 'tag1' }, { name: 'tag2' }],
        });
      }

      return Promise.reject(new Error('Unknown GET request'));
    });
  });

  test('renders notes and tags correctly', async () => {
    render(
      <Router>
        <NotesPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/mock note/i)).toBeInTheDocument();
    });

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getAllByText(/tag1/i).length).toBeGreaterThanOrEqual(1);
  });
});
