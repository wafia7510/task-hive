
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ExploreProfilesPage from '../pages/ExploreProfilesPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { axiosInstance } from '../api/axiosDefaults';

jest.mock('../api/axiosDefaults');

const mockProfiles = [
  {
    id: 1,
    username: 'alice',
    image: 'https://example.com/avatar1.jpg',
  },
  {
    id: 2,
    username: 'bob',
    image: 'https://example.com/avatar2.jpg',
  },
];

describe('ExploreProfilesPage', () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockProfiles });
  });

  it('renders profile cards correctly after loading', async () => {
    render(
      <AuthContext.Provider value={{ user: { username: 'testuser' } }}>
        <BrowserRouter>
          <ExploreProfilesPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/explore users/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('@alice')).toBeInTheDocument();
      expect(screen.getByText('@bob')).toBeInTheDocument();
      expect(screen.getAllByRole('img').length).toBeGreaterThan(1);
    });
  });
});
