// ✅ Mock axios first
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

// ✅ Inline mock component to prevent hoisting issues
jest.mock('../components/NavBar', () => ({
  __esModule: true,
  default: () => {
    const MockNavBar = () => <div data-testid="navbar">Mocked NavBar</div>;
    MockNavBar.displayName = 'MockNavBar';
    return <MockNavBar />;
  },
}));

// ✅ Imports after mocks
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../components/HomePage';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

describe('HomePage', () => {
  test('renders hero heading and mocked navbar', () => {
    const mockUser = { username: 'testuser' };

    render(
      <Router>
        <AuthContext.Provider value={{ user: mockUser }}>
          <HomePage />
        </AuthContext.Provider>
      </Router>
    );

    // ✅ Updated to current hero copy (robust to markup like <strong>)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /your smarter way to stay on track/i,
      })
    ).toBeInTheDocument();

    // ✅ Mocked navbar visible
    expect(screen.getByTestId('navbar')).toBeInTheDocument();

    // (Optional extra stability) also check a CTA that appears in your DOM
    expect(screen.getByRole('button', { name: /join us/i })).toBeInTheDocument();
  });
});
