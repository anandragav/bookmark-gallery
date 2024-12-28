import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarksHeader } from "@/components/BookmarksHeader";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { QuickAccess } from "@/components/QuickAccess";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("alphabetical");
  const [view, setView] = useState<"grid" | "list">("grid");
  const { 
    folders, 
    isLoading, 
    quickAccessBookmarks, 
    createFolder,
    createBookmark 
  } = useBookmarks();

  const filteredFolders = folders.filter((folder) =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.bookmarks.some((bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    switch (sortOption) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "bookmarkCount":
        return b.bookmarks.length - a.bookmarks.length;
      case "recent":
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BookmarksHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        view={view}
        onViewChange={setView}
        onFolderCreate={createFolder}
      />
      <QuickAccess bookmarks={quickAccessBookmarks} />
      <BookmarksGrid 
        folders={sortedFolders} 
        view={view} 
        isLoading={isLoading}
        onBookmarkAdd={createBookmark}
      />
    </div>
  );
};

export default Index;