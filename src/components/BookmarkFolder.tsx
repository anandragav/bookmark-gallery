import { Folder, ExternalLink, ChevronRight, Globe, Code, Newspaper, Share2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Bookmark {
  title: string;
  url: string;
}

interface BookmarkFolderProps {
  title: string;
  bookmarks: Bookmark[];
  thumbnailUrl?: string;
  view: "grid" | "list";
}

export function BookmarkFolder({ title, bookmarks, thumbnailUrl, view }: BookmarkFolderProps) {
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

  const renderThumbnail = () => {
    if (folderThumbnail && !thumbnailError) {
      return (
        <img
          src={folderThumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={() => setThumbnailError(true)}
        />
      );
    }
    
    return (
      <div className={`flex items-center justify-center h-full bg-gradient-to-br ${getBackgroundGradient(title)} transition-all duration-300 group-hover:opacity-80`}>
        {getFolderIcon(title)}
      </div>
    );
  };

  return (
    <Card 
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        view === "list" ? "flex" : ""
      }`}
    >
      <div className={view === "list" ? "flex flex-1" : ""}>
        <div className={`relative ${view === "list" ? "w-48" : "aspect-video"} overflow-hidden`}>
          {renderThumbnail()}
        </div>
        
        <div 
          className={`p-4 ${view === "list" ? "flex-1" : ""} cursor-pointer`}
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
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[400px] border-t" : "max-h-0"
        }`}
      >
        <div className="p-4 space-y-2">
          {bookmarks.map((bookmark, index) => {
            const faviconUrl = getFaviconUrl(bookmark.url);
            return (
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
          })}
        </div>
      </div>
    </Card>
  );
}