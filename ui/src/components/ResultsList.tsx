import React from 'react';
import { List } from 'antd';

type SearchResult = {
  title: string;
  abstract: string;
  publication_date: string;
}

type ResultsListProps = {
  results: SearchResult[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ results }) => (
  <List
    itemLayout="vertical"
    size="large"
    dataSource={results}
    renderItem={item => (
      <List.Item key={item.title}>
        <List.Item.Meta
          title={item.title}
          description={<div style={{ textAlign: 'justify' }}>{item.abstract}</div>}
        />
        <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
          Published on: {new Date(item.publication_date).toLocaleDateString()}
        </div>
      </List.Item>
    )}
  />
);
