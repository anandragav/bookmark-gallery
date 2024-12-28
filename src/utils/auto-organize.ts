import { pipeline } from "@huggingface/transformers";
import { Bookmark, ProcessedFolder } from "@/types/bookmark.types";

// Simple K-means implementation for clustering
class KMeans {
  private k: number;
  private maxIterations: number;

  constructor(k: number = 5, maxIterations: number = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
  }

  // Euclidean distance between two vectors
  private distance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
  }

  // Find the nearest centroid for a point
  private nearestCentroid(point: number[], centroids: number[][]): number {
    let minDistance = Infinity;
    let nearestIndex = 0;

    centroids.forEach((centroid, index) => {
      const distance = this.distance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  // Calculate mean of points
  private calculateMean(points: number[][]): number[] {
    const dimensions = points[0].length;
    const mean = new Array(dimensions).fill(0);

    points.forEach(point => {
      point.forEach((val, i) => mean[i] += val);
    });

    return mean.map(val => val / points.length);
  }

  // Main clustering method
  async fit(embeddings: number[][]): Promise<number[]> {
    // Initialize centroids randomly
    let centroids = embeddings
      .sort(() => Math.random() - 0.5)
      .slice(0, this.k);

    let labels = new Array(embeddings.length).fill(0);
    let iterations = 0;

    while (iterations < this.maxIterations) {
      // Assign points to nearest centroids
      const newLabels = embeddings.map(point => 
        this.nearestCentroid(point, centroids)
      );

      // Check if clusters have changed
      if (JSON.stringify(labels) === JSON.stringify(newLabels)) {
        break;
      }

      labels = newLabels;

      // Update centroids
      centroids = Array.from({ length: this.k }, (_, k) => {
        const clusterPoints = embeddings.filter((_, i) => labels[i] === k);
        return clusterPoints.length > 0 
          ? this.calculateMean(clusterPoints)
          : centroids[k];
      });

      iterations++;
    }

    return labels;
  }
}

export async function autoOrganizeBookmarks(
  bookmarks: Bookmark[],
  numClusters: number = 5
): Promise<ProcessedFolder[]> {
  try {
    // Initialize the feature extraction pipeline
    const extractor = await pipeline(
      "feature-extraction",
      "mixedbread-ai/mxbai-embed-xsmall-v1",
      { device: "cpu" }
    );

    // Get embeddings for all bookmarks
    const embeddings = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const text = `${bookmark.title} ${new URL(bookmark.url).hostname}`;
        const embedding = await extractor(text, { 
          pooling: "mean", 
          normalize: true 
        });
        return embedding.tolist()[0];
      })
    );

    // Perform clustering
    const kmeans = new KMeans(numClusters);
    const labels = await kmeans.fit(embeddings);

    // Group bookmarks by cluster
    const clusters = labels.reduce((acc: { [key: number]: Bookmark[] }, label, index) => {
      if (!acc[label]) {
        acc[label] = [];
      }
      acc[label].push(bookmarks[index]);
      return acc;
    }, {});

    // Convert clusters to folders
    const folders: ProcessedFolder[] = Object.entries(clusters).map(([label, bookmarks]) => {
      // Get the most common terms from bookmark titles in this cluster
      const words = bookmarks
        .flatMap(b => b.title.toLowerCase().split(/\W+/))
        .filter(word => word.length > 3)
        .reduce((acc: { [key: string]: number }, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});

      const topWords = Object.entries(words)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([word]) => word[0].toUpperCase() + word.slice(1));

      return {
        title: `${topWords.join(" & ")} Collection`,
        bookmarks
      };
    });

    return folders;
  } catch (error) {
    console.error("Error in auto-organizing bookmarks:", error);
    return [];
  }
}