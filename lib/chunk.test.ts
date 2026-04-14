// lib/chunk.test.ts
import { chunkText } from './chunk';

describe('chunkText', () => {
  it('should split text into chunks by paragraph', () => {
    const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(3);
    expect(chunks[0].text).toBe('First paragraph.');
  });

  it('should respect max chunk size', () => {
    const text = 'This is a very long paragraph that exceeds the maximum chunk size. '.repeat(50);
    const chunks = chunkText(text, { maxChunkSize: 100 });
    chunks.forEach((chunk) => {
      expect(chunk.text.length).toBeLessThanOrEqual(150); // ~100 chars + overlap
    });
  });

  it('should preserve metadata', () => {
    const chunks = chunkText('Content', { source: 'test.md' });
    expect(chunks[0].metadata.source).toBe('test.md');
    expect(chunks[0].metadata.chunkIndex).toBe(0);
  });
});
