// lib/minimax.test.ts
import { getEmbedding, getCompletion } from './minimax';

describe('MiniMax API', () => {
  const mockApiKey = 'test-key';

  describe('getEmbedding', () => {
    it('should return embedding array for text input', async () => {
      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            embedding: [0.1, 0.2, 0.3],
          },
        }),
      }) as jest.Mock;

      const result = await getEmbedding('hello world', mockApiKey);
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should throw error on API failure', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as jest.Mock;

      await expect(getEmbedding('test', mockApiKey)).rejects.toThrow('MiniMax API error: 401');
    });
  });

  describe('getCompletion', () => {
    it('should return completion text', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            choices: [{ text: 'Hello! How can I help?' }],
          },
        }),
      }) as jest.Mock;

      const result = await getCompletion('Hi', mockApiKey);
      expect(result).toBe('Hello! How can I help?');
    });
  });
});
