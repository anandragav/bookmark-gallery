import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { smartSearch } from "@/utils/smart-search";
import { Bookmark } from "@/types/bookmark.types";

interface BookmarkSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  folders: { title: string; bookmarks: Bookmark[] }[];
  onSmartSearchResults: (results: any[]) => void;
}

export function BookmarkSearch({ 
  searchQuery, 
  onSearchChange,
  folders,
  onSmartSearchResults
}: BookmarkSearchProps) {
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await smartSearch(searchQuery, folders);
          onSmartSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        onSmartSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, folders, onSmartSearchResults]);

  return (
    <div className="relative flex-1">
      {isSearching ? (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      )}
      <Input
        type="text"
        placeholder="Search bookmarks... (try natural language like 'that article about AI')"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}