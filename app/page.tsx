import Upload from '@/components/Upload';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>My RAG</h1>
      <p style={{ marginBottom: '2rem' }}>Upload documents and chat with them.</p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Upload />
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <a href="/chat" style={{ color: '#0070f3' }}>Go to Chat →</a>
        <a href="/search" style={{ color: '#0070f3' }}>Go to Search →</a>
      </div>
    </main>
  );
}
