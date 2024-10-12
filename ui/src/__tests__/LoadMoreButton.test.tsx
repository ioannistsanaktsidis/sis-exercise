import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { LoadMoreButton } from '../components/LoadMoreButton';

describe('LoadMoreButton', () => {
  const defaultProps = {
    resultsLength: 10,
    total: 20,
    loadMore: jest.fn(),
    loadMoreLoading: false,
  };

  it('renders the Load More button when resultsLength is less than total', () => {
    render(<LoadMoreButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).toBeInTheDocument();
  });

  it('does not render the Load More button when resultsLength is equal to or greater than total', () => {
    const props = { ...defaultProps, resultsLength: 20 };
    render(<LoadMoreButton {...props} />);
    const button = screen.queryByRole('button', { name: /load more/i });
    expect(button).not.toBeInTheDocument();
  });
});
