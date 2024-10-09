import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ResultsList } from './ResultsList';


const mockResults = [
    {
        title: 'First Result',
        abstract: 'This is the abstract of the first result.',
        publication_date: '2021-01-01',
    },
    {
        title: 'Second Result',
        abstract: 'This is the abstract of the second result.',
        publication_date: '2021-02-01',
    },
];

describe('ResultsList', () => {
    it('renders correctly with provided data', () => {
        render(<ResultsList results={mockResults} />);


        expect(screen.getByText('First Result')).toBeInTheDocument();
        expect(screen.getByText('This is the abstract of the first result.')).toBeInTheDocument();
        expect(screen.getByText('Published on: 1/1/2021')).toBeInTheDocument();

        expect(screen.getByText('Second Result')).toBeInTheDocument();
        expect(screen.getByText('This is the abstract of the second result.')).toBeInTheDocument();
        expect(screen.getByText('Published on: 2/1/2021')).toBeInTheDocument();
    });

    it('displays the correct number of items', () => {
        render(<ResultsList results={mockResults} />);

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(mockResults.length);
    });

    it('displays the correct title, abstract, and publication date for each item', () => {
        render(<ResultsList results={mockResults} />);

        mockResults.forEach(result => {
            expect(screen.getByText(result.title)).toBeInTheDocument();
            expect(screen.getByText(result.abstract)).toBeInTheDocument();
            expect(screen.getByText(`Published on: ${new Date(result.publication_date).toLocaleDateString()}`)).toBeInTheDocument();
        });
    });
});
