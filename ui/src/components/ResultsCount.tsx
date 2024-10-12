import React from "react";

type ResultsCountProps = {
  total: number;
};

export const ResultsCount: React.FC<ResultsCountProps> = ({ total }) => {
  if (total > 0) {
    return (
      <div style={{ padding: "22px" }}>
        <div>{total} results</div>
      </div>
    );
  }

  return null;
};
