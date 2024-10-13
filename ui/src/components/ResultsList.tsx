import React from "react";
import { List } from "antd";
import { SearchResult } from "../types";
import { LoadMoreButton } from "./LoadMoreButton";

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
}) => (
  <List
    itemLayout="vertical"
    size="large"
    loadMore={
      <LoadMoreButton
        resultsLength={results.length}
        total={total}
        loadMore={loadMore}
        loadMoreLoading={loadMoreLoading}
      />
    }
    dataSource={results}
    renderItem={(item) => (
      <List.Item key={item.title}>
        <List.Item.Meta
          title={item.title}
          description={
            <div style={{ textAlign: "justify" }}>{item.abstract}</div>
          }
        />
        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
          Published on: {new Date(item.publicationDate).toLocaleDateString()}
        </div>
      </List.Item>
    )}
  />
);
