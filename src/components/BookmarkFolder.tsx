import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FolderHeader } from "@/components/FolderHeader";
import { BookmarkList } from "@/components/BookmarkList";

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
  const { toast } = useToast();

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

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
      view === "list" ? "flex" : ""
    }`}>
      <div className="flex">
        <div 
          className="cursor-pointer flex-1 flex"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <FolderHeader
            title={title}
            thumbnailUrl={thumbnailUrl}
            bookmarksCount={bookmarks.length}
            view={view}
          />
          <button 
            className="p-4"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
          >
            <ChevronRight 
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : "group-hover:translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[400px] border-t" : "max-h-0"
        }`}
      >
        <BookmarkList
          bookmarks={bookmarks}
          copiedStates={copiedStates}
          onCopyUrl={handleCopyUrl}
        />
      </div>
    </Card>
  );
}