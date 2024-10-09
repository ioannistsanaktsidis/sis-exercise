import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ results: [], summary: '', total: 0 }),
  })
) as jest.Mock;

describe('App', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

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

  it('displays the "No results found" message when there are no search results', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: [], summary: '', total: 0 }),
      })
    );

    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'noresults' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('No results found. Please refine your query!')).toBeInTheDocument();
    });
  });

  it('displays the "Load More" button when there are more results to load', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          results: [
            { title: 'First Result', abstract: 'Abstract 1', publication_date: '2021-01-01' },
            { title: 'Second Result', abstract: 'Abstract 2', publication_date: '2021-02-01' },
          ],
          summary: 'Summary of results',
          total: 20,
        }),
      })
    );

    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'more' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });
});
