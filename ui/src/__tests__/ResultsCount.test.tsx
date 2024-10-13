import React from "react";
import { render, screen } from "@testing-library/react";
import { ResultsCount } from "../components/ResultsCount";

describe("ResultsCount", () => {
  it("renders the correct number of results when total is greater than 0", () => {
    render(<ResultsCount total={5} />);
    expect(screen.getByText("5 results")).toBeInTheDocument();
  });

  it("renders nothing when total is 0", () => {
    render(<ResultsCount total={0} />);
    expect(screen.queryByText(/results/i)).toBeNull();
  });
});
