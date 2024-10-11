import React from "react";

type NoResultsMessageProps = {
  show: boolean;
};

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ show }) => {
  if (show) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No results found. Please refine your query!
      </div>
    );
  }
  return null;
};
