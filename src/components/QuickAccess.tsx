import { Card } from "@/components/ui/card";
import { ExternalLink, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Bookmark {
  title: string;
  url: string;
}

interface QuickAccessProps {
  bookmarks: Bookmark[];
}

export function QuickAccess({ bookmarks }: QuickAccessProps) {
  const { toast } = useToast();

  const handleCopyUrl = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "URL Copied",
        description: `Copied ${title}'s URL to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  if (bookmarks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Quick Access</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.slice(0, 6).map((bookmark, index) => (
          <Card key={index} className="p-4 flex items-center justify-between gap-2 hover:shadow-md transition-shadow">
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
              onClick={() => handleCopyUrl(bookmark.url, bookmark.title)}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Copy URL</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}