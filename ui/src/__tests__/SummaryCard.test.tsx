import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SummaryCard } from "../components/SummaryCard";

describe("SummaryCard", () => {
  it("renders the summary when provided", () => {
    const summaryText = "This is a summary";
    render(<SummaryCard summary={summaryText} />);

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText(summaryText)).toBeInTheDocument();
  });

  it("does not render the card when summary is not provided", () => {
    render(<SummaryCard summary="" />);

    expect(screen.queryByText("Summary")).not.toBeInTheDocument();
  });
});
