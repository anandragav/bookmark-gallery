import { BookmarkFolder } from "@/components/BookmarkFolder";

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
}

export function BookmarksGrid({ folders }: BookmarksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {folders.map((folder, index) => (
        <BookmarkFolder
          key={index}
          title={folder.title}
          bookmarks={folder.bookmarks}
          thumbnailUrl={folder.thumbnailUrl}
        />
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