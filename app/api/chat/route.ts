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
      text: String(match.metadata?.text || ''),
      score: match.score || 0,
      metadata: {
        source: String(match.metadata?.source || 'unknown'),
        chunkIndex: Number(match.metadata?.chunkIndex || 0),
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
