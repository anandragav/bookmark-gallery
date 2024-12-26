import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  copiedStates: { [key: string]: boolean };
  onCopyUrl: (url: string, title: string) => void;
}

export function BookmarkList({ bookmarks, copiedStates, onCopyUrl }: BookmarkListProps) {
  return (
    <div className="p-4 space-y-2">
      {bookmarks.map((bookmark, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors flex-1"
          >
            <ExternalLink className="w-4 h-4" />
            {bookmark.title}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onCopyUrl(bookmark.url, bookmark.title);
            }}
          >
            {copiedStates[bookmark.url] ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}