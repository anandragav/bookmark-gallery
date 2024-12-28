import { useState, useCallback } from "react";
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
    removeBookmark,
    moveBookmark 
  } = useBookmarks();

  const handleFolderCreate = useCallback((folderName: string) => {
    createFolder(folderName);
  }, [createFolder]);

  const [smartSearchResults, setSmartSearchResults] = useState<any[]>([]);

  const filteredFolders = searchQuery && smartSearchResults.length > 0
    ? smartSearchResults.reduce((acc: any[], result) => {
        const folderIndex = acc.findIndex(f => f.title === result.folderTitle);
        if (folderIndex === -1) {
          acc.push({
            title: result.folderTitle,
            bookmarks: [{ title: result.title, url: result.url }]
          });
        } else {
          acc[folderIndex].bookmarks.push({ title: result.title, url: result.url });
        }
        return acc;
      }, [])
    : folders.filter((folder) =>
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
        onFolderCreate={handleFolderCreate}
        folders={folders}
        onSmartSearchResults={setSmartSearchResults}
      />
      <QuickAccess bookmarks={quickAccessBookmarks} />
      <BookmarksGrid 
        folders={sortedFolders} 
        view={view} 
        isLoading={isLoading}
        onRemoveBookmark={removeBookmark}
        onMoveBookmark={moveBookmark}
        availableFolders={folders.map(f => f.title)}
      />
    </div>
  );
};

export default Index;