'use client';

import { useState } from 'react';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setMessage('Please select a file');
      setUploading(false);
      return;
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Success! Processed ${data.chunkCount} chunks from ${file.name}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Upload Document</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="file"
          name="file"
          accept=".md,.txt"
          required
          style={{ padding: '0.5rem' }}
        />
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: uploading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          {message}
        </p>
      )}
    </div>
  );
}
