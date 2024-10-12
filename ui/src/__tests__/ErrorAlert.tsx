import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ErrorAlert } from '../components/ErrorAlert';


describe('ErrorAlert', () => {
  it('renders the Alert when error is not null', () => {
    const errorMessage = "This is an error message";
    render(<ErrorAlert error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not render the Alert when error is null', () => {
    render(<ErrorAlert error={null} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
