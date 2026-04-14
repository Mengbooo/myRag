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
