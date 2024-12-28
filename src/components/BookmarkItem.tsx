import { ExternalLink, Copy, Check, Trash2, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

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
  folderTitle: string;
  onRemoveBookmark: (url: string, folderTitle: string) => void;
  onMoveBookmark: (url: string, fromFolder: string, toFolder: string) => void;
  availableFolders: string[];
}

export function BookmarkItem({ 
  bookmark, 
  index, 
  isExpanded,
  copiedStates,
  handleCopyUrl,
  getFaviconUrl,
  folderTitle,
  onRemoveBookmark,
  onMoveBookmark,
  availableFolders
}: BookmarkItemProps) {
  const faviconUrl = getFaviconUrl(bookmark.url);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

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
      <div className="flex items-center gap-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <MoveRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableFolders
              .filter(folder => folder !== folderTitle)
              .map((folder) => (
                <DropdownMenuItem
                  key={folder}
                  onClick={() => onMoveBookmark(bookmark.url, folderTitle, folder)}
                >
                  Move to {folder}
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => onRemoveBookmark(bookmark.url, folderTitle)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}