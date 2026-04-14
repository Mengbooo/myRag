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
