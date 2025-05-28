// ✅ Mock axiosInstance first to avoid the Axios-ESM issue
jest.mock('../api/axiosDefaults', () => ({
  axiosInstance: {
    get:    jest.fn(() => Promise.resolve({ data: [] })),
    post:   jest.fn(() => Promise.resolve({ data: {} })),
    put:    jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { AuthContext } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Login Page', () => {
  test('renders login form correctly', () => {
    const mockLogin = jest.fn();            // stubbed login()

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // ✅ Basic UI assertions
    expect(
      screen.getByRole('heading', { name: /login to taskhive/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // The visible button text is “Login”
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
