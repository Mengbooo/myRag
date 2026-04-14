// app/api/search/route.test.ts
import { getEmbedding } from '@/lib/minimax';
import * as pineconeModule from '@/lib/pinecone';

jest.mock('@/lib/minimax');
jest.mock('@/lib/pinecone');

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results', async () => {
    (getEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);

    const mockQueryResult = {
      matches: [
        { id: '1', score: 0.9, metadata: { text: 'React is a library', source: 'react.md', chunkIndex: 0 } },
      ],
    };
    
    (pineconeModule.queryVector as jest.Mock).mockResolvedValue(mockQueryResult);

    const { POST } = require('./route');

    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ query: 'React' }),
      headers: { 'Content-Type': 'application/json' },
    }));

    const data = await response.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].metadata.source).toBe('react.md');
  });
});
