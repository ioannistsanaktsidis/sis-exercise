import React, { useState } from 'react';
import { Layout, List, Input, Spin, Alert, Card, Button } from 'antd';
import './App.css';

const { Search } = Input;
const { Header, Content } = Layout;

type SearchResult = {
  title: string;
  abstract: string;
  publication_date: string;
}

const LIMIT = 10;

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const fetchResults = async (value: string, newOffset: number) => {
    setLoading(true);
    setError(null);
    try {
      const queryParam = value.trim() ? `?query=${value}&limit=${LIMIT}&offset=${newOffset}` : `?limit=${LIMIT}&offset=${newOffset}`;
      const response = await fetch(`http://localhost:8000/api/search/${queryParam}`);
      const data = await response.json();
      setResults(prevResults => [...prevResults, ...data.results]);
      setSummary(data.summary);
      setTotal(data.total);
      setOffset(newOffset);
    } catch (error) {
      setError('An error occurred while fetching search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (value: string) => {
    setResults([]);
    setOffset(0);
    fetchResults(value, 0);
  };

  const loadMore = () => {
    fetchResults(searchTerm, offset + LIMIT);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ color: 'white', fontSize: '24px' }}>INSPIRE HEP</Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <div style={{ width: '80%' }}>
            <Search
              placeholder="Search..."
              enterButton="Search"
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={onSearch}
            />
            {error && <Alert message={error} type="error" showIcon style={{ marginTop: '20px' }} />}
            {summary && (
              <Card title="Summary" size="small" style={{ marginTop: '20px' }}>
                <p>{summary}</p>
              </Card>
            )}
          </div>
        </div>
        {loading && <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '80%' }}>
            {total > 0 && (
              <div style={{ marginBottom: '20px', marginLeft: '20px' }}>
                <div>{total} results</div>
              </div>
            )}
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
            {results.length < total && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button onClick={loadMore} loading={loading}>Load More</Button>
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
