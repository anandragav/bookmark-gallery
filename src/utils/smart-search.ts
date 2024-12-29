import { pipeline } from "@huggingface/transformers";
import { Bookmark } from "@/types/bookmark.types";

let embeddingModel: any = null;
let isSmartSearchAvailable = true;

export async function initializeEmbeddingModel() {
  if (!embeddingModel) {
    try {
      // Try WebGPU first
      embeddingModel = await pipeline(
        "feature-extraction",
        "mixedbread-ai/mxbai-embed-xsmall-v1",
        { device: "webgpu" }
      );
    } catch (error) {
      console.log("WebGPU not available, falling back to WASM");
      try {
        // Fall back to WASM if WebGPU is not available
        embeddingModel = await pipeline(
          "feature-extraction",
          "mixedbread-ai/mxbai-embed-xsmall-v1",
          { device: "wasm" }
        );
      } catch (wasmError) {
        console.log("Smart search is not available on this device");
        isSmartSearchAvailable = false;
        return null;
      }
    }
  }
  return embeddingModel;
}

export async function getEmbeddings(text: string) {
  if (!isSmartSearchAvailable) return null;
  
  const model = await initializeEmbeddingModel();
  if (!model) return null;
  
  const embeddings = await model(text, { pooling: "mean", normalize: true });
  return embeddings.tolist()[0];
}

export async function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

interface BookmarkWithScore extends Bookmark {
  score: number;
  folderTitle: string;
}

export async function smartSearch(query: string, folders: { title: string; bookmarks: Bookmark[] }[]) {
  if (!isSmartSearchAvailable) {
    // Fall back to basic text search
    return folders.reduce((results: BookmarkWithScore[], folder) => {
      const matchingBookmarks = folder.bookmarks.filter(bookmark => {
        const searchText = `${bookmark.title} ${bookmark.url}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      }).map(bookmark => ({
        ...bookmark,
        score: 1,
        folderTitle: folder.title
      }));
      return [...results, ...matchingBookmarks];
    }, []);
  }

  try {
    const queryEmbedding = await getEmbeddings(query.toLowerCase());
    if (!queryEmbedding) return [];

    const results: BookmarkWithScore[] = [];

    for (const folder of folders) {
      for (const bookmark of folder.bookmarks) {
        const bookmarkText = `${bookmark.title} ${bookmark.url}`.toLowerCase();
        const bookmarkEmbedding = await getEmbeddings(bookmarkText);
        if (!bookmarkEmbedding) continue;
        
        const similarity = await cosineSimilarity(queryEmbedding, bookmarkEmbedding);

        results.push({
          ...bookmark,
          score: similarity,
          folderTitle: folder.title
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .filter(result => result.score > 0.5);
  } catch (error) {
    console.error('Error in smart search:', error);
    return [];
  }
}