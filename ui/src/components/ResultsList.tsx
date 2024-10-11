import React from "react";
import { Button, List } from "antd";

type SearchResult = {
  title: string;
  abstract: string;
  publication_date: string;
};

type ResultsListProps = {
  results: SearchResult[];
  total: number;
  loadMore: () => void;
  loadMoreLoading: boolean;
};

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  total,
  loadMore,
  loadMoreLoading
}) => {
  const buttonLoadMore =
    results.length < total ? (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={loadMore} loading={loadMoreLoading}>
          Load More
        </Button>
      </div>
    ) : null;

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={results}
      loadMore={buttonLoadMore}
      renderItem={(item) => (
        <List.Item key={item.title}>
          <List.Item.Meta
            title={item.title}
            description={
              <div style={{ textAlign: "justify" }}>{item.abstract}</div>
            }
          />
          <div style={{ marginTop: "10px", fontStyle: "italic" }}>
            Published on: {new Date(item.publication_date).toLocaleDateString()}
          </div>
        </List.Item>
      )}
    />
  );
};
