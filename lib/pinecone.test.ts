// lib/pinecone.test.ts
import { upsertVector, queryVector } from './pinecone';

// Mock the Pinecone client
jest.mock('@pinecone-database/pinecone', () => ({
  Pinecone: jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnValue({
      upsert: jest.fn().mockResolvedValue({}),
      query: jest.fn().mockResolvedValue({
        matches: [
          {
            id: 'chunk-1',
            score: 0.9,
            metadata: { text: 'test content', source: 'doc.md' },
          },
        ],
      }),
    }),
    createIndex: jest.fn().mockResolvedValue({}),
  })),
}));

describe('Pinecone Client', () => {
  describe('upsertVector', () => {
    it('should upsert vectors to Pinecone', async () => {
      const index = {
        upsert: jest.fn().mockResolvedValue({}),
      };

      await upsertVector(index as any, [
        { id: 'chunk-1', values: [0.1, 0.2], metadata: { text: 'test' } },
      ]);

      expect(index.upsert).toHaveBeenCalled();
    });
  });

  describe('queryVector', () => {
    it('should query vectors and return matches', async () => {
      const index = {
        query: jest.fn().mockResolvedValue({
          matches: [{ id: 'chunk-1', score: 0.9 }],
        }),
      };

      const result = await queryVector(index as any, [0.1, 0.2], 5);

      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].id).toBe('chunk-1');
    });
  });
});
