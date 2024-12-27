import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookmarkItemProps {
  bookmark: {
    title: string;
    url: string;
  };
  index: number;
  isExpanded: boolean;
  copiedStates: { [key: string]: boolean };
  handleCopyUrl: (url: string, title: string) => void;
  getFaviconUrl: (url: string) => string | null;
}

export function BookmarkItem({ 
  bookmark, 
  index, 
  isExpanded,
  copiedStates,
  handleCopyUrl,
  getFaviconUrl
}: BookmarkItemProps) {
  const faviconUrl = getFaviconUrl(bookmark.url);

  return (
    <div
      className={`flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted animate-fade-in opacity-0 ${
        isExpanded ? "opacity-100" : ""
      }`}
      style={{ 
        animationDelay: `${index * 50}ms`,
        transition: 'opacity 0.3s ease-in-out',
        transitionDelay: `${index * 50}ms`
      }}
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm hover:text-primary transition-colors flex-1"
      >
        {faviconUrl ? (
          <img 
            src={faviconUrl} 
            alt="" 
            className="w-4 h-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <ExternalLink className="w-4 h-4" />
        )}
        {bookmark.title}
      </a>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation();
          handleCopyUrl(bookmark.url, bookmark.title);
        }}
      >
        {copiedStates[bookmark.url] ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}