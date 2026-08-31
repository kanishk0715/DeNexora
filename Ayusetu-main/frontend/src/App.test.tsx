import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Academia-Industry Collaboration Portal/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the Smart India Hackathon subtitle', () => {
    render(<App />);
    const subtitle = screen.getByText(/Smart India Hackathon 2024/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders user role cards', () => {
    render(<App />);
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Academicians')).toBeInTheDocument();
    expect(screen.getByText('Industry')).toBeInTheDocument();
  });

  it('renders configuration success message', () => {
    render(<App />);
    const message = screen.getByText(/Frontend Successfully Configured/i);
    expect(message).toBeInTheDocument();
  });
});
