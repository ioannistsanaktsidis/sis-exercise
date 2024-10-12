import { Button } from "antd";
import React from "react";

type LoadMoreButtonProps = {
  resultsLength: number;
  total: number;
  loadMore: () => void;
  loadMoreLoading: boolean;
};

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  resultsLength,
  total,
  loadMore,
  loadMoreLoading
}) => {
  if (resultsLength < total) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={loadMore} loading={loadMoreLoading}>
          Load More
        </Button>
      </div>
    );
  }
  return null;
};
