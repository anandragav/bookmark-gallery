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
            .filter((child) => child.url)
            .map((child) => ({
              title: child.title,
              url: child.url!,
            }));

          if (bookmarks.length > 0) {
            processedFolders.push({
              title: node.title,
              bookmarks,
              thumbnailUrl: undefined,
            });
          }
        }

        if (node.children) {
          node.children.forEach(processNode);
        }
      };

      bookmarks.forEach(processNode);
      return processedFolders;
    };

    // Check if Chrome bookmarks API is available
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const processedFolders = processBookmarks(bookmarkTreeNodes);
        setFolders(processedFolders);
      });
    } else {
      // Sample data for development
      const sampleFolders: ProcessedFolder[] = [
        {
          title: "Development Resources",
          bookmarks: [
            { title: "GitHub", url: "https://github.com" },
            { title: "Stack Overflow", url: "https://stackoverflow.com" },
            { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
          ],
        },
        {
          title: "Social Media",
          bookmarks: [
            { title: "Twitter", url: "https://twitter.com" },
            { title: "LinkedIn", url: "https://linkedin.com" },
            { title: "Facebook", url: "https://facebook.com" },
          ],
        },
        {
          title: "News",
          bookmarks: [
            { title: "BBC News", url: "https://bbc.com/news" },
            { title: "CNN", url: "https://cnn.com" },
            { title: "The Guardian", url: "https://theguardian.com" },
          ],
        },
      ];
      setFolders(sampleFolders);
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