import { BookmarkFolder } from "@/components/BookmarkFolder";
import { BookmarkSkeleton } from "@/components/BookmarkSkeleton";

interface Bookmark {
  title: string;
  url: string;
}

interface ProcessedFolder {
  title: string;
  thumbnailUrl?: string;
  bookmarks: Bookmark[];
}

interface BookmarksGridProps {
  folders: ProcessedFolder[];
  view: "grid" | "list";
  isLoading?: boolean;
  onRemoveBookmark: (url: string, folderTitle: string) => void;
  onMoveBookmark: (url: string, fromFolder: string, toFolder: string) => void;
  onDeleteFolder: (folderTitle: string) => void;
  availableFolders: string[];
}

export function BookmarksGrid({ 
  folders, 
  view, 
  isLoading,
  onRemoveBookmark,
  onMoveBookmark,
  onDeleteFolder,
  availableFolders
}: BookmarksGridProps) {
  if (isLoading) {
    return (
      <div className={view === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "flex flex-col gap-4"
      }>
        {Array.from({ length: 6 }).map((_, index) => (
          <BookmarkSkeleton key={index} view={view} />
        ))}
      </div>
    );
  }

  return (
    <div className={view === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
      : "flex flex-col gap-4"
    }>
      {folders.map((folder, index) => (
        <div key={index} className="h-fit">
          <BookmarkFolder
            title={folder.title}
            bookmarks={folder.bookmarks}
            thumbnailUrl={folder.thumbnailUrl}
            view={view}
            onRemoveBookmark={onRemoveBookmark}
            onMoveBookmark={onMoveBookmark}
            onDeleteFolder={onDeleteFolder}
            availableFolders={availableFolders}
          />
        </div>
      ))}
      {folders.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-lg text-muted-foreground">
            No bookmarks found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}