import { useEffect, useState } from "react";
import { BookmarkFolder } from "@/components/BookmarkFolder";

interface ChromeBookmark {
  id: string;
  title: string;
  url?: string;
  children?: ChromeBookmark[];
}

interface ProcessedFolder {
  title: string;
  thumbnailUrl?: string;
  bookmarks: { title: string; url: string }[];
}

const Index = () => {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);

  useEffect(() => {
    const processBookmarks = (bookmarks: ChromeBookmark[]) => {
      const processedFolders: ProcessedFolder[] = [];

      const processNode = (node: ChromeBookmark) => {
        if (!node.url && node.children) {
          // This is a folder
          const bookmarks = node.children
            .filter((child) => child.url) // Only include actual bookmarks
            .map((child) => ({
              title: child.title,
              url: child.url!,
            }));

          if (bookmarks.length > 0) {
            processedFolders.push({
              title: node.title,
              bookmarks,
              // You could potentially extract thumbnail from the first bookmark's favicon
              thumbnailUrl: undefined,
            });
          }
        }

        // Recursively process children
        if (node.children) {
          node.children.forEach(processNode);
        }
      };

      bookmarks.forEach(processNode);
      return processedFolders;
    };

    // Get Chrome bookmarks
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const processedFolders = processBookmarks(bookmarkTreeNodes);
        setFolders(processedFolders);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Bookmarks Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Your bookmarks, beautifully organized
          </p>
        </header>

        <div className="masonry-grid">
          {folders.map((folder, index) => (
            <BookmarkFolder
              key={index}
              title={folder.title}
              bookmarks={folder.bookmarks}
              thumbnailUrl={folder.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;