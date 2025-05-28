// ✅ First: mock 'axiosInstance' before any imports
jest.mock('../api/axiosDefaults', () => ({
  axiosInstance: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import Signup from '../pages/Signup';
import { AuthContext } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Signup Page', () => {
  test('renders signup form correctly', () => {
    const mockSignup = jest.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ signup: mockSignup }}>
          <Signup />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit registration form/i })).toBeInTheDocument();

  });
});
