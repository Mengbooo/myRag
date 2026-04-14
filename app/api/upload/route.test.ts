// app/api/upload/route.test.ts
import { POST } from './route';
import { chunkText } from '@/lib/chunk';
import { getEmbedding } from '@/lib/minimax';
import { getIndex } from '@/lib/pinecone';

// Mock dependencies
jest.mock('@/lib/chunk');
jest.mock('@/lib/minimax');
jest.mock('@/lib/pinecone');

describe('/api/upload', () => {
  it('should upload and process a document', async () => {
    const mockChunks = [
      { id: '1', text: 'test', metadata: { text: 'test', source: 'doc.md', chunkIndex: 0, createdAt: '' } },
    ];
    (chunkText as jest.Mock).mockReturnValue(mockChunks);
    (getEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    (getIndex as jest.Mock).mockReturnValue({ upsert: jest.fn().mockResolvedValue({}) });

    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'doc.md');

    const response = await POST(new Request('http://localhost', { method: 'POST', body: formData }));
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.chunkCount).toBe(1);
  });
});
