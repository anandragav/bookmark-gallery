import { Folder, ExternalLink, ChevronRight, Globe, Code, Newspaper, Share2 } from "lucide-react";
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

  const getFolderIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('development')) return <Code className="w-12 h-12 text-primary/60" />;
    if (lowercaseTitle.includes('social')) return <Share2 className="w-12 h-12 text-primary/60" />;
    if (lowercaseTitle.includes('news')) return <Newspaper className="w-12 h-12 text-primary/60" />;
    return <Globe className="w-12 h-12 text-primary/60" />;
  };

  const getBackgroundGradient = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('development')) return 'from-blue-500/5 to-blue-500/10';
    if (lowercaseTitle.includes('social')) return 'from-purple-500/5 to-purple-500/10';
    if (lowercaseTitle.includes('news')) return 'from-orange-500/5 to-orange-500/10';
    return 'from-gray-500/5 to-gray-500/10';
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative aspect-video overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={`flex items-center justify-center h-full bg-gradient-to-br ${getBackgroundGradient(title)}`}>
              {getFolderIcon(title)}
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
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
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