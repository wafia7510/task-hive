// src/__tests__/ProfilePage.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/ProfilePage';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// 👇 Import your custom axios instance
import { axiosInstance } from '../api/axiosDefaults';

// ✅ Mock the axiosInstance directly
jest.mock('../api/axiosDefaults', () => ({
  axiosInstance: {
    get: jest.fn(),
    put: jest.fn(),
  }
}));

describe('ProfilePage', () => {
  const mockProfile = {
    username: 'testuser',
    bio: 'This is a test bio.',
    image: '',
    followers_count: 10,
    following_count: 5,
    is_following: false,
  };

  it('renders profile data correctly after loading', async () => {
    // 👇 Set up mocked GET request
    axiosInstance.get.mockImplementation((url) => {
  if (url.includes('/api/profiles/me/')) {
    return Promise.resolve({ data: mockProfile });
  }
  if (url.includes('/api/profiles/username/testuser/')) {
    return Promise.resolve({ data: mockProfile });
  }
  return Promise.reject(new Error('Not found'));
});


    render(
      <AuthContext.Provider value={{ user: { username: 'someone' } }}>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // ✅ Assert profile fields
    await waitFor(() =>
      expect(screen.getByText(/this is a test bio/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/followers:/i)).toBeInTheDocument();
    expect(screen.getByText(/following:/i)).toBeInTheDocument();
  });
});
