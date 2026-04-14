# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RAG (Retrieval-Augmented Generation) MVP application that processes documents and provides chat and search capabilities using MiniMax API and Pinecone.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 14** with App Router (React 18, TypeScript)
- **MiniMax API** - LLM text generation + text embeddings
- **Pinecone** - Cloud vector database for similarity search

### Data Flow

**Document Upload:**
1. User uploads .md/.txt file via `/api/upload`
2. Text is chunked into smaller pieces
3. Each chunk is embedded via MiniMax Embedding API
4. Vectors stored in Pinecone with metadata (source, chunkIndex, text)

**Chat/Search:**
1. User query → MiniMax Embedding → vector
2. Pinecone similarity search → top-K relevant chunks
3. Chunks + query → MiniMax LLM → answer/sources

### Project Structure (target state)

```
app/
├── page.tsx              # Home with upload
├── chat/page.tsx        # Chat interface
├── search/page.tsx      # Search interface
└── api/
    ├── upload/route.ts  # POST: upload + chunk + embed + store
    ├── chat/route.ts    # POST: embed query + retrieve + LLM
    └── search/route.ts  # POST: embed query + retrieve

lib/
├── pinecone.ts          # Pinecone client (initPinecone, getIndex, upsertVector, queryVector)
├── minimax.ts           # MiniMax API client (getEmbedding, getCompletion)
└── chunk.ts             # Text chunking utility

components/
├── Upload.tsx           # Document upload form
├── Chat.tsx             # Chat UI with sources display
└── Search.tsx           # Search results display
```

### Pinecone Index Schema
- Dimension: 1024 (MiniMax embedding)
- Metadata: text, source, chunkIndex, createdAt

## Environment Variables

```
PINECONE_API_KEY=<key>
PINECONE_INDEX_NAME=my-rag
MINIMAX_API_KEY=<key>
MINIMAX_EMBEDDING_MODEL=embo-01
MINIMAX_LLM_MODEL=abab6.5s-chat
```

## Implementation Status

Task 1 complete (Next.js init). Tasks 2-12 pending - see docs/superpowers/plans/2026-04-14-rag-mvp-implementation-plan.md for full task list.

## Working with this codebase

- Components in `/components` are client components ('use client')
- API routes in `/app/api` use Next.js App Router conventions
- `lib/` contains shared utilities for Pinecone, MiniMax, and text processing
- Use `@/*` path alias for imports (configured in tsconfig.json)
