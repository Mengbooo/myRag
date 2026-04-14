// lib/minimax.ts

const MINIMAX_API_BASE = 'https://api.minimax.chat/v1';

export async function getEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  const response = await fetch(`${MINIMAX_API_BASE}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_EMBEDDING_MODEL || 'embo-01',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data.embedding;
}

export async function getCompletion(
  prompt: string,
  apiKey: string,
  model?: string
): Promise<string> {
  const response = await fetch(`${MINIMAX_API_BASE}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || process.env.MINIMAX_LLM_MODEL || 'abab6.5s-chat',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data.choices[0].text || data.data.choices[0].message?.content || '';
}
