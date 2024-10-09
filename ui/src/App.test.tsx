import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('App', () => {
  it('renders the main elements of the App component', () => {
    render(<App />);

    expect(screen.getByText('INSPIRE HEP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();

  });

  it('displays the loading spinner when loading', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'loading' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
