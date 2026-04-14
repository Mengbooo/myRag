'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 10 }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Search</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your documents..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && results.length === 0 && (
        <p style={{ color: '#666' }}>No results found.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div
            key={result.id}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{result.metadata.source}</strong>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>
                Score: {(result.score * 100).toFixed(1)}%
              </span>
            </div>
            <p style={{ margin: 0 }}>{result.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
