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
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    
    // If single paragraph exceeds max, split by words
    if (trimmedParagraph.length > maxChunkSize) {
      const words = trimmedParagraph.split(' ');
      let currentChunk = '';
      
      for (const word of words) {
        if (currentChunk.length + word.length + 1 > maxChunkSize) {
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
            const overlapWords = currentChunk.split(' ').slice(-Math.floor(overlap / 5));
            currentChunk = overlapWords.join(' ') + ' ';
          }
        }
        currentChunk += word + ' ';
      }
      
      if (currentChunk.trim()) {
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
      }
    } else {
      // Paragraph fits, add as a chunk
      chunks.push({
        id: generateId(),
        text: trimmedParagraph,
        metadata: {
          text: trimmedParagraph,
          source,
          chunkIndex: chunkIndex++,
          createdAt: new Date().toISOString(),
        },
      });
    }
  }

  return chunks;
}
