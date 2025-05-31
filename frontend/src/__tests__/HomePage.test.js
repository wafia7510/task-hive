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
import { AuthContext } from '../contexts/AuthContext'; // ✅ Import context

describe('HomePage', () => {
  test('renders hero heading and mocked navbar', () => {
    const mockUser = { username: 'testuser' }; // ✅ mock user object

    render(
      <Router>
        <AuthContext.Provider value={{ user: mockUser }}>
          <HomePage />
        </AuthContext.Provider>
      </Router>
    );

    expect(
      screen.getByText(/organize your study life with ease/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
