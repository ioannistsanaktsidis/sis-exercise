import React, { useState } from "react";
import { Layout, Input, Button } from "antd";

import { SearchResult } from "./types";
import { SummaryCard } from "./components/SummaryCard";
import { NoResultsMessage } from "./components/NoResultsMessage";
import { ResultsList } from "./components/ResultsList";
import { Loading } from "./components/Loading";
import { ErrorAlert } from "./components/ErrorAlert";
import { ResultsCount } from "./components/ResultsCount";
import { getErrorMessage } from "./utils/utils";

import { ERROR_MESSAGES, LIMIT } from "./constants/constants";

import "./App.css";

const { Search } = Input;
const { Header, Content } = Layout;

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchResults = async (value: string, newOffset: number) => {
    setLoading(true);
    setError(null);
    try {
      const queryParam = value.trim()
        ? `?query=${value}&limit=${LIMIT}&offset=${newOffset}`
        : `?limit=${LIMIT}&offset=${newOffset}`;
      const response = await fetch(
        `http://localhost:8000/api/search/${queryParam}`
      );

      if (!response.ok) {
        const errorMessage = getErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResults((prevResults) => [...prevResults, ...data.results]);
      setSummary(data.summary);
      setTotal(data.total);
      setOffset(newOffset);
    } catch (error) {
      setResults([]);
      setSummary("");
      setTotal(0);
      setOffset(0);
      if (error instanceof Error) {
        setError(error?.message ?? ERROR_MESSAGES.UNEXPECTED_ERROR);
      } else {
        setError(ERROR_MESSAGES.UNEXPECTED_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (value: string) => {
    setResults([]);
    setOffset(0);
    setSummary("");
    setTotal(0);
    setHasSearched(true);
    fetchResults(value, 0);
  };

  const loadMore = async () => {
    setLoadMoreLoading(true);
    await fetchResults(searchTerm, offset + LIMIT);
    setLoadMoreLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header style={{ color: "white", fontSize: "24px" }}>INSPIRE HEP</Header>
      <Content style={{ padding: "20px" }}>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <div style={{ width: "80%" }}>
            <Search
              placeholder="Search..."
              enterButton="Search"
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={onSearch}
            />
            <Loading loading={loading && !loadMoreLoading} />
            <ErrorAlert error={error} />
            <SummaryCard summary={summary} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "80%", paddingLeft: "20px", paddingRight: "20px" }}>
            <ResultsCount total={total} />
            {results.length > 0 ? (
              <ResultsList results={results} />
            ) : (
              <NoResultsMessage show={hasSearched && !loading && !error} />
            )}
            {results.length < total && results.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  type="primary"
                  onClick={loadMore}
                  loading={loadMoreLoading}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
