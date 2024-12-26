import { useEffect, useState } from "react";
import { BookmarksHeader } from "@/components/BookmarksHeader";
import { BookmarksGrid } from "@/components/BookmarksGrid";

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

type SortOption = "alphabetical" | "bookmarkCount" | "recent";

const Index = () => {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");

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

  const filteredFolders = folders.filter((folder) => {
    const folderMatchesSearch = folder.title.toLowerCase().includes(searchQuery.toLowerCase());
    const bookmarksMatchSearch = folder.bookmarks.some(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return folderMatchesSearch || bookmarksMatchSearch;
  });

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    switch (sortOption) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "bookmarkCount":
        return b.bookmarks.length - a.bookmarks.length;
      case "recent":
        // For demo purposes, we'll just reverse the alphabetical order
        // In a real implementation, you'd want to track creation/modification dates
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookmarksHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={(value) => setSortOption(value as SortOption)}
        />
        <BookmarksGrid folders={sortedFolders} />
      </div>
    </div>
  );
};

export default Index;