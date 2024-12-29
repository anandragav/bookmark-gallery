import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarksHeader } from "@/components/BookmarksHeader";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { QuickAccess } from "@/components/QuickAccess";
import { Particles } from "@/components/Particles";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("alphabetical");
  const [view, setView] = useState<"grid" | "list">("grid");
  const { 
    folders, 
    isLoading, 
    quickAccessBookmarks, 
    removeBookmark,
  } = useBookmarks();

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
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={50}
        ease={50}
        color={document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'}
      />
      <div className="container mx-auto px-4 py-8 relative">
        <BookmarksHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          view={view}
          onViewChange={setView}
          folders={folders}
          onSmartSearchResults={setSmartSearchResults}
        />
        <QuickAccess bookmarks={quickAccessBookmarks} />
        <BookmarksGrid 
          folders={sortedFolders} 
          view={view} 
          isLoading={isLoading}
          onRemoveBookmark={removeBookmark}
          availableFolders={folders.map(f => f.title)}
        />
      </div>
    </div>
  );
};

export default Index;