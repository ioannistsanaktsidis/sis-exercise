import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Loading } from "../components/Loading";

describe("Loading", () => {
  it("renders the spinner when loading is true", () => {
    render(<Loading loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("does not render the spinner when loading is false", () => {
    render(<Loading loading={false} />);

    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
