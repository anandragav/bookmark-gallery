import { ChevronRight, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BookmarkItem } from "./BookmarkItem";
import { FolderThumbnail } from "./FolderThumbnail";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bookmark } from "@/types/bookmark.types";

interface BookmarkFolderProps {
  title: string;
  bookmarks: Bookmark[];
  thumbnailUrl?: string;
  view: "grid" | "list";
  onRemoveBookmark: (url: string, folderTitle: string) => void;
  availableFolders: string[];
}

export function BookmarkFolder({ 
  title, 
  bookmarks, 
  thumbnailUrl, 
  view,
  onRemoveBookmark,
  availableFolders
}: BookmarkFolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [folderThumbnail, setFolderThumbnail] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (bookmarks.length > 0) {
      try {
        const firstBookmarkUrl = new URL(bookmarks[0].url).toString();
        setFolderThumbnail(`https://api.screenshotone.com/take?access_key=DEMO&url=${encodeURIComponent(firstBookmarkUrl)}&viewport_width=800&viewport_height=600&device_scale_factor=1&format=jpg&block_ads=true&block_trackers=true&cache_ttl=2592000`);
        setThumbnailError(false);
      } catch (error) {
        console.error('Invalid URL:', error);
        setFolderThumbnail(null);
        setThumbnailError(true);
      }
    }
  }, [bookmarks]);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const handleCopyUrl = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedStates({ ...copiedStates, [url]: true });
      toast({
        title: "URL Copied",
        description: `Copied ${title}'s URL to clipboard`,
      });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [url]: false }));
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  return (
    <Card 
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        view === "list" ? "flex" : ""
      }`}
    >
      <div className={view === "list" ? "flex flex-1" : ""}>
        <div className={`relative ${view === "list" ? "w-48" : "aspect-video"} overflow-hidden`}>
          <FolderThumbnail 
            title={title}
            folderThumbnail={folderThumbnail}
            thumbnailError={thumbnailError}
            onThumbnailError={handleThumbnailError}
          />
        </div>
        
        <div 
          className={`p-4 ${view === "list" ? "flex-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div 
              className="flex-1 cursor-pointer"
              onClick={handleToggle}
            >
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete folder</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete folder</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the folder "{title}" and all its bookmarks? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onRemoveBookmark(title)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 space-y-2 border-t">
            {bookmarks.map((bookmark, index) => (
              <BookmarkItem
                key={index}
                bookmark={bookmark}
                index={index}
                isExpanded={isExpanded}
                copiedStates={copiedStates}
                handleCopyUrl={handleCopyUrl}
                getFaviconUrl={getFaviconUrl}
                folderTitle={title}
                onRemoveBookmark={onRemoveBookmark}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
