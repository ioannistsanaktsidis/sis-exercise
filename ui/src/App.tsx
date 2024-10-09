import React, { useState } from 'react';
import { Layout, List, Input, Spin, Alert, Card } from 'antd';
import './App.css';

const { Search } = Input;
const { Header, Content } = Layout;

interface SearchResult {
  title: string;
  abstract: string;
  publication_date: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      const queryParam = value.trim() ? `?query=${value}` : '';
      const response = await fetch(`http://localhost:8000/api/search${queryParam}`);
      const data = await response.json();
      setResults(data.results);
      setSummary(data.summary);
    } catch (error) {
      setError('An error occured while fetching search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout  style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
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
        <List
          itemLayout="vertical"
          size="large"
          dataSource={results}
          renderItem={item => (
            <List.Item key={item.title}>
              <List.Item.Meta
                title={item.title}
                description={item.abstract}
              />
              <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
                Published on: {new Date(item.publication_date).toLocaleDateString()}
              </div>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
}

export default App;
