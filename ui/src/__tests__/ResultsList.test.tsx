import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ResultsList } from "../components/ResultsList";

const mockResults = [
  {
    title: "First Result",
    abstract: "This is the abstract of the first result.",
    publicationDate: "2021-01-01"
  },
  {
    title: "Second Result",
    abstract: "This is the abstract of the second result.",
    publicationDate: "2021-02-01"
  }
];

const defaultProps = {
    results: mockResults,
    total: 4,
    loadMore: jest.fn(),
    loadMoreLoading: false,
  };

describe("ResultsList", () => {
  it("renders correctly with provided data", () => {
    render(<ResultsList {...defaultProps}  />);

    expect(screen.getByText("First Result")).toBeInTheDocument();
    expect(
      screen.getByText("This is the abstract of the first result.")
    ).toBeInTheDocument();
    expect(screen.getByText("Published on: 1/1/2021")).toBeInTheDocument();

    expect(screen.getByText("Second Result")).toBeInTheDocument();
    expect(
      screen.getByText("This is the abstract of the second result.")
    ).toBeInTheDocument();
    expect(screen.getByText("Published on: 2/1/2021")).toBeInTheDocument();
  });


  it("displays the correct title, abstract, and publication date for each item", () => {
    render(<ResultsList {...defaultProps}  />);

    mockResults.forEach((result) => {
      expect(screen.getByText(result.title)).toBeInTheDocument();
      expect(screen.getByText(result.abstract)).toBeInTheDocument();
      expect(
        screen.getByText(
          `Published on: ${new Date(
            result.publicationDate
          ).toLocaleDateString()}`
        )
      ).toBeInTheDocument();
    });
  });


  it("displays the Load More button when there are more results", () => {
    const props = { ...defaultProps };
    render(<ResultsList {...props} />);

    const loadMoreButton = screen.getByRole("button", { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();
  });

});
