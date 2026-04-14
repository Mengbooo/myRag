// app/api/chat/route.test.ts
import { getEmbedding, getCompletion } from '@/lib/minimax';
import * as pineconeModule from '@/lib/pinecone';

// Mock modules
jest.mock('@/lib/minimax');
jest.mock('@/lib/pinecone');

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return answer with sources', async () => {
    // Mock getEmbedding
    (getEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    
    // Mock getCompletion
    (getCompletion as jest.Mock).mockResolvedValue('Paris is the capital of France.');

    // Mock queryVector to return our mock result
    const mockQueryResult = {
      matches: [
        { id: '1', score: 0.9, metadata: { text: 'The capital of France is Paris.', source: 'france.md' } },
      ],
    };
    
    (pineconeModule.queryVector as jest.Mock).mockResolvedValue(mockQueryResult);

    // Import POST after mocks are set up
    const { POST } = require('./route');

    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'What is the capital of France?' }),
      headers: { 'Content-Type': 'application/json' },
    }));

    const data = await response.json();
    expect(data.answer).toBe('Paris is the capital of France.');
    expect(data.sources).toHaveLength(1);
    expect(pineconeModule.queryVector).toHaveBeenCalled();
  });
});
