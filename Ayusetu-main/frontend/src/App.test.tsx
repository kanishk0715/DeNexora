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

  it('lists all 22 official Indian languages plus English', () => {
    render(<App />);
    const select = screen.getByLabelText(/Language/i);
    expect(select.querySelectorAll('option').length).toBe(23);
    expect(select.querySelector('optgroup')?.getAttribute('label')).toBe('Official languages of India');
    expect(select.querySelectorAll('optgroup option').length).toBe(22);
  });

  it('renders the ministry logo in the navbar', () => {
    render(<App />);
    expect(screen.getAllByAltText(/Ministry of Ayush/i).length).toBeGreaterThan(0);
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
