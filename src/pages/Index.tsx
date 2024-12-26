import { useEffect, useState, useRef, useCallback } from "react";
import { BookmarksHeader } from "@/components/BookmarksHeader";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { useToast } from "@/components/ui/use-toast";
import { useHotkeys } from "react-hotkeys-hook";

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
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [displayedFolders, setDisplayedFolders] = useState<ProcessedFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [view, setView] = useState<ViewMode>("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const { toast } = useToast();

  // Keyboard shortcuts
  useHotkeys('ctrl+f', (e) => {
    e.preventDefault();
    document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
  });

  useHotkeys('g', () => setView('grid'));
  useHotkeys('l', () => setView('list'));
  useHotkeys('esc', () => setSearchQuery(''));

  const processBookmarks = useCallback((bookmarks: ChromeBookmark[]) => {
    const processedFolders: ProcessedFolder[] = [];

    const processNode = (node: ChromeBookmark) => {
      if (!node.url && node.children) {
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
  }, []);

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            const processedFolders = processBookmarks(bookmarkTreeNodes);
            setFolders(processedFolders);
            setIsLoading(false);
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
          setTimeout(() => setIsLoading(false), 1000);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load bookmarks. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchBookmarks();
  }, [processBookmarks, toast]);

  // Filter and sort folders
  useEffect(() => {
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
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setDisplayedFolders(sortedFolders.slice(0, page * ITEMS_PER_PAGE));
  }, [folders, searchQuery, sortOption, page]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedFolders.length < folders.length) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [displayedFolders.length, folders.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookmarksHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={(value) => setSortOption(value as SortOption)}
          view={view}
          onViewChange={setView}
        />
        <BookmarksGrid 
          folders={displayedFolders} 
          view={view} 
          isLoading={isLoading}
        />
        {!isLoading && displayedFolders.length < folders.length && (
          <div ref={loadingRef} className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;