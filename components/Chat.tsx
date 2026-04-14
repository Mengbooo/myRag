'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ text: string; metadata: { source: string } }>;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not answer that.',
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Failed to get response' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Chat</h2>
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#666' }}>Ask a question about your documents...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Assistant: '}</strong>
            <p style={{ margin: '0.5rem 0' }}>{msg.content}</p>
            {msg.sources && msg.sources.length > 0 && (
              <details style={{ fontSize: '0.875rem', color: '#666' }}>
                <summary>Sources ({msg.sources.length})</summary>
                {msg.sources.map((s, j) => (
                  <div key={j} style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f5f5f5' }}>
                    <em>{s.metadata.source}</em>: {s.text.substring(0, 100)}...
                  </div>
                ))}
              </details>
            )}
          </div>
        ))}
        {loading && <p style={{ color: '#666' }}>Thinking...</p>}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
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
          Send
        </button>
      </form>
    </div>
  );
}
