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
