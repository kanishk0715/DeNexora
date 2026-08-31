import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders AyuSetu branding', () => {
    render(<App />);
    expect(screen.getAllByText(/AyuSetu/i).length).toBeGreaterThan(0);
  });

  it('renders role entry cards', () => {
    render(<App />);
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Institute')).toBeInTheDocument();
    expect(screen.getByText('Ministry of AYUSH')).toBeInTheDocument();
  });

  it('renders the idea subtitle', () => {
    render(<App />);
    expect(screen.getAllByText(/AYUSH skill bridge/i).length).toBeGreaterThan(0);
  });
});
