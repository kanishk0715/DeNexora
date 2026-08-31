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
    expect(screen.getByText('Faculty')).toBeInTheDocument();
    expect(screen.getByText('Hospital')).toBeInTheDocument();
    expect(screen.getByText('Institute')).toBeInTheDocument();
    expect(screen.getAllByText('Ministry of AYUSH').length).toBeGreaterThan(0);
  });

  it('renders institute partners and About', () => {
    render(<App />);
    expect(screen.getByText('NIA')).toBeInTheDocument();
    expect(screen.getByText('AIIA')).toBeInTheDocument();
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  });

  it('renders the idea subtitle', () => {
    render(<App />);
    expect(screen.getAllByText(/AYUSH skill bridge/i).length).toBeGreaterThan(0);
  });

  it('puts Login in the navbar, not as the home screen', () => {
    render(<App />);
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Match real clinical skills/i })).toBeInTheDocument();
  });

  it('renders a branded 404 with navbar', () => {
    window.history.pushState({}, '', '/this-page-does-not-exist');
    render(<App />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
  });

  it('renders a branded 403 with navbar', () => {
    window.history.pushState({}, '', '/unauthorized');
    render(<App />);
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
  });
});
