import { useState, useRef, useEffect } from "react";
import { BookmarksHeader } from "@/components/BookmarksHeader";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { QuickAccess } from "@/components/QuickAccess";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useHotkeys } from "react-hotkeys-hook";

type SortOption = "alphabetical" | "bookmarkCount" | "recent";
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const { folders, isLoading, quickAccessBookmarks } = useBookmarks();
  const [displayedFolders, setDisplayedFolders] = useState(folders);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);

  // Keyboard shortcuts
  useHotkeys('ctrl+f', (e) => {
    e.preventDefault();
    document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
  });
  useHotkeys('g', () => setView('grid'));
  useHotkeys('l', () => setView('list'));
  useHotkeys('esc', () => setSearchQuery(''));

  const handleCreateFolder = (folderName: string) => {
    const newFolder = {
      title: folderName,
      bookmarks: [],
    };
    setDisplayedFolders((prev) => [...prev, newFolder]);
  };

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
        <div className="mb-6 flex justify-end">
          <CreateFolderDialog onFolderCreate={handleCreateFolder} />
        </div>
        <QuickAccess bookmarks={quickAccessBookmarks} />
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