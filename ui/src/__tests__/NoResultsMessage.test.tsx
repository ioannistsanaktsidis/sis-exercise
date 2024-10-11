import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NoResultsMessage } from '../components/NoResultsMessage';

describe('NoResultsMessage', () => {
  it('renders the message when show is true', () => {
    render(<NoResultsMessage show={true} />);

    expect(screen.getByText('No results found. Please refine your query!')).toBeInTheDocument();
  });

  it('does not render the message when show is false', () => {
    render(<NoResultsMessage show={false} />);

    expect(screen.queryByText('No results found. Please refine your query!')).not.toBeInTheDocument();
  });
});
