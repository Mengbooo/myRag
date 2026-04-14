# RAG MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimum viable RAG application that processes documents and provides chat and search capabilities using MiniMax API and Pinecone.

**Architecture:** Next.js app with API routes handling document upload, chat, and search. Documents are chunked, embedded via MiniMax, and stored in Pinecone. Chat and search queries retrieve relevant chunks and generate responses via MiniMax LLM.

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, Pinecone (vector DB), MiniMax API (LLM + Embedding)

---

## File Structure

```
myRag/
├── app/
│   ├── page.tsx                    # Home page with upload
│   ├── chat/page.tsx              # Chat interface
│   ├── search/page.tsx           # Search interface
│   └── api/
│       ├── upload/route.ts        # Document upload endpoint
│       ├── chat/route.ts         # Chat endpoint
│       └── search/route.ts       # Search endpoint
├── components/
│   ├── Upload.tsx                 # Document upload component
│   ├── Chat.tsx                  # Chat UI component
│   └── Search.tsx                # Search UI component
├── lib/
│   ├── pinecone.ts               # Pinecone client initialization
│   ├── minimax.ts               # MiniMax API client (LLM + Embedding)
│   └── chunk.ts                 # Text chunking utility
├── package.json
└── .env.local                   # Environment variables
```

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `.env.local.example`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `.gitignore`

- [ ] **Step 1: Create project directory structure**

```bash
mkdir -p myRag/app/api/{upload,chat,search}
mkdir -p myRag/app/{chat,search}
mkdir -p myRag/components
mkdir -p myRag/lib
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "my-rag",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@pinecone-database/pinecone": "^2.0.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

module.exports = nextConfig;
```

- [ ] **Step 5: Create .env.local.example**

```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=my-rag

MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_EMBEDDING_MODEL=embo-01
MINIMAX_LLM_MODEL=abab6.5s-chat
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
.next/
.env
.env.local
```

- [ ] **Step 7: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My RAG',
  description: 'Document Q&A with RAG',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create app/page.tsx**

```tsx
export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>My RAG</h1>
      <p>Upload documents and chat with them.</p>
    </main>
  );
}
```

- [ ] **Step 9: Install dependencies**

```bash
cd /Users/qiumengbo.123/Desktop/myRag && npm install
```

- [ ] **Step 10: Verify build**

```bash
npm run build
```

Expected: Build completes without errors

- [ ] **Step 11: Commit**

```bash
git init && git add -A && git commit -m "feat: initialize Next.js project

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create Environment Configuration

**Files:**
- Create: `.env.local` (from .env.local.example with actual values)

- [ ] **Step 1: Create .env.local with your credentials**

```
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=my-rag

MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_EMBEDDING_MODEL=embo-01
MINIMAX_LLM_MODEL=abab6.5s-chat
```

**Note:** Replace with actual keys from Pinecone and MiniMax dashboards.

- [ ] **Step 2: Commit**

```bash
git add .env.local.example && git commit -m "docs: add env.local.example

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Implement MiniMax API Client

**Files:**
- Create: `lib/minimax.ts`
- Create: `lib/minimax.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
      });

      const result = await getEmbedding('hello world', mockApiKey);
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should throw error on API failure', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });

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
      });

      const result = await getCompletion('Hi', mockApiKey);
      expect(result).toBe('Hello! How can I help?');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/minimax.test.ts
```

Expected: FAIL - "getEmbedding is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/minimax.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/minimax.ts lib/minimax.test.ts && git commit -m "feat: implement MiniMax API client

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Implement Pinecone Client

**Files:**
- Create: `lib/pinecone.ts`
- Create: `lib/pinecone.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/pinecone.test.ts
import { initPinecone, upsertVector, queryVector, CreateIndexOptions } from './pinecone';

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/pinecone.test.ts
```

Expected: FAIL with "upsertVector is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

export interface VectorMetadata {
  text: string;
  source: string;
  chunkIndex: number;
  createdAt: string;
}

export interface PineconeVector {
  id: string;
  values: number[];
  metadata: VectorMetadata;
}

let pineconeClient: Pinecone | null = null;

export function initPinecone(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });
  }
  return pineconeClient;
}

export function getIndex() {
  const client = initPinecone();
  const indexName = process.env.PINECONE_INDEX_NAME || 'my-rag';
  return client.index(indexName);
}

export async function upsertVector(
  index: ReturnType<Pinecone['index']>,
  vectors: PineconeVector[]
): Promise<void> {
  await index.upsert(vectors);
}

export async function queryVector(
  index: ReturnType<Pinecone['index']>,
  queryVector: number[],
  topK: number = 5
) {
  return index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });
}

export interface CreateIndexOptions {
  dimension: number;
  metric?: 'cosine' | 'euclidean' | 'dotproduct';
}

export async function createIndexIfNotExists(
  client: Pinecone,
  name: string,
  opts: CreateIndexOptions
): Promise<void> {
  const existingIndexes = await client.listIndexes();
  const exists = existingIndexes.indexes?.some((idx) => idx.name === name);

  if (!exists) {
    await client.createIndex({
      name,
      dimension: opts.dimension,
      metric: opts.metric || 'cosine',
    });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/pinecone.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/pinecone.ts lib/pinecone.test.ts && git commit -m "feat: implement Pinecone client

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Implement Text Chunking

**Files:**
- Create: `lib/chunk.ts`
- Create: `lib/chunk.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/chunk.test.ts
import { chunkText } from './chunk';

describe('chunkText', () => {
  it('should split text into chunks by paragraph', () => {
    const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toBe('First paragraph.');
  });

  it('should respect max chunk size', () => {
    const text = 'This is a very long paragraph that exceeds the maximum chunk size. '.repeat(50);
    const chunks = chunkText(text, { maxChunkSize: 100 });
    chunks.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(150); // ~100 chars + overlap
    });
  });

  it('should preserve metadata', () => {
    const chunks = chunkText('Content', { source: 'test.md' });
    expect(chunks[0].metadata.source).toBe('test.md');
    expect(chunks[0].metadata.chunkIndex).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- lib/chunk.test.ts
```

Expected: FAIL - "chunkText is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/chunk.ts
export interface Chunk {
  id: string;
  text: string;
  metadata: {
    text: string;
    source: string;
    chunkIndex: number;
    createdAt: string;
  };
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  source?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function chunkText(text: string, options: ChunkOptions = {}): Chunk[] {
  const { maxChunkSize = 500, overlap = 50, source = 'unknown' } = options;

  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  const chunks: Chunk[] = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();

    if (currentChunk.length + trimmedParagraph.length + 2 > maxChunkSize) {
      if (currentChunk) {
        chunks.push({
          id: generateId(),
          text: currentChunk.trim(),
          metadata: {
            text: currentChunk.trim(),
            source,
            chunkIndex: chunkIndex++,
            createdAt: new Date().toISOString(),
          },
        });

        // Keep overlap
        const words = currentChunk.split(' ');
        currentChunk = words.slice(-Math.floor(overlap / 5)).join(' ') + ' ';
      }
    }

    currentChunk += trimmedParagraph + '\n\n';
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push({
      id: generateId(),
      text: currentChunk.trim(),
      metadata: {
        text: currentChunk.trim(),
        source,
        chunkIndex: chunkIndex,
        createdAt: new Date().toISOString(),
      },
    });
  }

  return chunks;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- lib/chunk.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/chunk.ts lib/chunk.test.ts && git commit -m "feat: implement text chunking utility

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Implement Upload API

**Files:**
- Create: `app/api/upload/route.ts`
- Create: `app/api/upload/route.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- app/api/upload/route.test.ts
```

Expected: FAIL - "POST is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { chunkText } from '@/lib/chunk';
import { getEmbedding } from '@/lib/minimax';
import { getIndex, upsertVector, PineconeVector } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/markdown', 'text/plain', 'text/x-markdown'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      return NextResponse.json(
        { success: false, message: 'Only .md and .txt files are supported' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();

    // Chunk the text
    const chunks = chunkText(content, { source: file.name });

    // Get embeddings and upsert to Pinecone
    const index = getIndex();
    const vectors: PineconeVector[] = [];

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk.text, process.env.MINIMAX_API_KEY || '');

      vectors.push({
        id: chunk.id,
        values: embedding,
        metadata: chunk.metadata,
      });
    }

    await upsertVector(index, vectors);

    return NextResponse.json({
      success: true,
      chunkCount: chunks.length,
      message: `Successfully processed ${file.name}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- app/api/upload/route.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/upload/route.ts app/api/upload/route.test.ts && git commit -m "feat: implement document upload API

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Implement Chat API

**Files:**
- Create: `app/api/chat/route.ts`
- Create: `app/api/chat/route.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// app/api/chat/route.test.ts
import { POST } from './route';
import { getEmbedding } from '@/lib/minimax';
import { getIndex } from '@/lib/pinecone';
import { getCompletion } from '@/lib/minimax';

jest.mock('@/lib/minimax');
jest.mock('@/lib/pinecone');

describe('/api/chat', () => {
  it('should return answer with sources', async () => {
    (getEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    (getIndex as jest.Mock).mockReturnValue({
      query: jest.fn().mockResolvedValue({
        matches: [
          { id: '1', score: 0.9, metadata: { text: 'The capital of France is Paris.', source: 'france.md' } },
        ],
      }),
    });
    (getCompletion as jest.Mock).mockResolvedValue('Paris is the capital of France.');

    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ question: 'What is the capital of France?' }),
      headers: { 'Content-Type': 'application/json' },
    }));

    const data = await response.json();
    expect(data.answer).toBe('Paris is the capital of France.');
    expect(data.sources).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- app/api/chat/route.test.ts
```

Expected: FAIL - "POST is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding, getCompletion } from '@/lib/minimax';
import { getIndex, queryVector } from '@/lib/pinecone';

interface Source {
  id: string;
  text: string;
  score: number;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { answer: '', sources: [], error: 'Question is required' },
        { status: 400 }
      );
    }

    // Get query embedding
    const queryEmbedding = await getEmbedding(question, process.env.MINIMAX_API_KEY || '');

    // Query Pinecone for relevant chunks
    const index = getIndex();
    const queryResult = await queryVector(index, queryEmbedding, 5);

    const sources: Source[] = queryResult.matches?.map((match) => ({
      id: match.id,
      text: match.metadata?.text || '',
      score: match.score || 0,
      metadata: {
        source: match.metadata?.source || 'unknown',
        chunkIndex: match.metadata?.chunkIndex || 0,
      },
    })) || [];

    // Build context from sources
    const context = sources.map((s) => s.text).join('\n\n');

    // Build prompt
    const prompt = `You are a helpful assistant. Based on the following context, answer the question.

Context:
${context}

Question: ${question}

Answer:`;

    // Get completion from MiniMax
    const answer = await getCompletion(prompt, process.env.MINIMAX_API_KEY || '');

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { answer: '', sources: [], error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- app/api/chat/route.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/chat/route.ts app/api/chat/route.test.ts && git commit -m "feat: implement chat API

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Implement Search API

**Files:**
- Create: `app/api/search/route.ts`
- Create: `app/api/search/route.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// app/api/search/route.test.ts
import { POST } from './route';
import { getEmbedding } from '@/lib/minimax';
import { getIndex } from '@/lib/pinecone';

jest.mock('@/lib/minimax');
jest.mock('@/lib/pinecone');

describe('/api/search', () => {
  it('should return search results', async () => {
    (getEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    (getIndex as jest.Mock).mockReturnValue({
      query: jest.fn().mockResolvedValue({
        matches: [
          { id: '1', score: 0.9, metadata: { text: 'React is a library', source: 'react.md' } },
        ],
      }),
    });

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- app/api/search/route.test.ts
```

Expected: FAIL - "POST is not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/minimax';
import { getIndex, queryVector } from '@/lib/pinecone';

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 10 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { results: [], error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get query embedding
    const queryEmbedding = await getEmbedding(query, process.env.MINIMAX_API_KEY || '');

    // Query Pinecone
    const index = getIndex();
    const queryResult = await queryVector(index, queryEmbedding, topK);

    const results: SearchResult[] = queryResult.matches?.map((match) => ({
      id: match.id,
      text: match.metadata?.text || '',
      score: match.score || 0,
      metadata: {
        source: match.metadata?.source || 'unknown',
        chunkIndex: match.metadata?.chunkIndex || 0,
      },
    })) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { results: [], error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- app/api/search/route.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/search/route.ts app/api/search/route.test.ts && git commit -m "feat: implement search API

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Implement Upload Component

**Files:**
- Create: `components/Upload.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Update app/page.tsx to include Upload**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/Upload.tsx app/page.tsx && git commit -m "feat: add upload component and home page

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Implement Chat Component

**Files:**
- Create: `components/Chat.tsx`
- Create: `app/chat/page.tsx`

- [ ] **Step 1: Write the Chat component**

```tsx
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ text: string; metadata: { source: string } }>;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not answer that.',
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Failed to get response' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Chat</h2>
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#666' }}>Ask a question about your documents...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Assistant: '}</strong>
            <p style={{ margin: '0.5rem 0' }}>{msg.content}</p>
            {msg.sources && msg.sources.length > 0 && (
              <details style={{ fontSize: '0.875rem', color: '#666' }}>
                <summary>Sources ({msg.sources.length})</summary>
                {msg.sources.map((s, j) => (
                  <div key={j} style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f5f5f5' }}>
                    <em>{s.metadata.source}</em>: {s.text.substring(0, 100)}...
                  </div>
                ))}
              </details>
            )}
          </div>
        ))}
        {loading && <p style={{ color: '#666' }}>Thinking...</p>}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Create app/chat/page.tsx**

```tsx
import Chat from '@/components/Chat';

export default function ChatPage() {
  return <Chat />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Chat.tsx app/chat/page.tsx && git commit -m "feat: add chat component and page

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Implement Search Component

**Files:**
- Create: `components/Search.tsx`
- Create: `app/search/page.tsx`

- [ ] **Step 1: Write the Search component**

```tsx
'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 10 }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Search</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your documents..."
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && results.length === 0 && (
        <p style={{ color: '#666' }}>No results found.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((result) => (
          <div
            key={result.id}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{result.metadata.source}</strong>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>
                Score: {(result.score * 100).toFixed(1)}%
              </span>
            </div>
            <p style={{ margin: 0 }}>{result.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/search/page.tsx**

```tsx
import Search from '@/components/Search';

export default function SearchPage() {
  return <Search />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Search.tsx app/search/page.tsx && git commit -m "feat: add search component and page

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: End-to-End Test

**Files:** None (manual testing)

- [ ] **Step 1: Start the development server**

```bash
npm run dev
```

- [ ] **Step 2: Test upload flow**
1. Open http://localhost:3000
2. Upload a .md or .txt file
3. Verify success message with chunk count

- [ ] **Step 3: Test chat flow**
1. Navigate to /chat
2. Ask a question about the uploaded document
3. Verify answer with sources

- [ ] **Step 4: Test search flow**
1. Navigate to /search
2. Search for a keyword from the document
3. Verify relevant results appear

- [ ] **Step 5: Commit final changes**

```bash
git add -A && git commit -m "feat: complete RAG MVP with upload, chat, and search

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Spec Coverage Check

| Spec Section | Tasks |
|--------------|-------|
| Document upload (.md, .txt) | Task 6, Task 9 |
| Text chunking | Task 5 |
| Chat interface | Task 7, Task 10 |
| Search interface | Task 8, Task 11 |
| Sources in answer | Task 7, Task 10 |
| MiniMax API | Task 3 |
| Pinecone storage | Task 4 |
| Next.js App Router | Task 1 |
