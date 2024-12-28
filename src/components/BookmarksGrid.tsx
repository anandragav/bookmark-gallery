import { BookmarkFolder } from "@/components/BookmarkFolder";
import { BookmarkSkeleton } from "@/components/BookmarkSkeleton";

interface Bookmark {
  title: string;
  url: string;
}

interface ProcessedFolder {
  id: string;
  title: string;
  thumbnailUrl?: string;
  bookmarks: Bookmark[];
}

interface BookmarksGridProps {
  folders: ProcessedFolder[];
  view: "grid" | "list";
  isLoading?: boolean;
  onBookmarkAdd?: (folderId: string, bookmark: Bookmark) => void;
}

export function BookmarksGrid({ 
  folders, 
  view, 
  isLoading,
  onBookmarkAdd
}: BookmarksGridProps) {
  if (isLoading) {
    return (
      <div className={view === "grid" 
        ? "grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4" 
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
      ? "grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4" 
      : "flex flex-col gap-4"
    }>
      {folders.map((folder) => (
        <div key={folder.id} className="h-fit">
          <BookmarkFolder
            id={folder.id}
            title={folder.title}
            bookmarks={folder.bookmarks}
            thumbnailUrl={folder.thumbnailUrl}
            view={view}
            onBookmarkAdd={onBookmarkAdd}
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