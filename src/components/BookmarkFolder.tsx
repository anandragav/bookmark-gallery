import { Folder, ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkFolderProps {
  title: string;
  bookmarks: Bookmark[];
  thumbnailUrl?: string;
}

export function BookmarkFolder({ title, bookmarks, thumbnailUrl }: BookmarkFolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/5 to-primary/10">
              <Folder className="w-12 h-12 text-primary/40" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            <ChevronRight 
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : "group-hover:translate-x-1"
              }`}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {bookmarks.length} bookmarks
          </p>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[400px] border-t" : "max-h-0"
        }`}
      >
        <div className="p-4 space-y-2">
          {bookmarks.map((bookmark, index) => (
            <a
              key={index}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
            >
              <ExternalLink className="w-4 h-4" />
              {bookmark.title}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}