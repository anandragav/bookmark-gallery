import { useEffect, useState } from "react";
import { BookmarkFolder } from "@/components/BookmarkFolder";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Bookmarks Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your bookmarks, beautifully organized in an elegant gallery view
          </p>
          <div className="flex items-center gap-4 max-w-md mx-auto mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="bookmarkCount">Bookmark Count</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {sortedFolders.map((folder, index) => (
            <BookmarkFolder
              key={index}
              title={folder.title}
              bookmarks={folder.bookmarks}
              thumbnailUrl={folder.thumbnailUrl}
            />
          ))}
          {sortedFolders.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No bookmarks found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;