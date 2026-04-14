// lib/minimax.ts

const MINIMAX_API_BASE = 'https://api.minimax.chat/v1';

function getGroupId(): string {
  return process.env.MINIMAX_GROUP_ID || '';
}

export async function getEmbedding(
  text: string,
  apiKey: string,
  type: 'db' | 'query' = 'db'
): Promise<number[]> {
  const groupId = getGroupId();
  const url = `${MINIMAX_API_BASE}/embeddings?GroupId=${groupId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_EMBEDDING_MODEL || 'embo-01',
      texts: [text],
      type,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  // vectors is [[float32, float32, ...]], one array per input text
  return data.vectors?.[0] || [];
}

export async function getCompletion(
  prompt: string,
  apiKey: string
): Promise<string> {
  const groupId = getGroupId();
  const url = `${MINIMAX_API_BASE}/text/chatcompletion?GroupId=${groupId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_LLM_MODEL || 'abab5-chat',
      prompt: prompt,
      role_meta: {
        user_name: '用户',
        bot_name: '智能助理',
      },
      messages: [
        {
          sender_type: 'USER',
          text: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  // Response format based on MiniMax docs
  return data.choices?.[0]?.text || data.base_resp?.status_msg || '';
}
