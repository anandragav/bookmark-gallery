import { Link } from "react-router-dom";
import { BookmarkSearch } from "./BookmarkSearch";
import { ThemeToggle } from "./ThemeToggle";
import { ViewToggle } from "./ViewToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Folder } from "@/types/bookmark.types";

interface BookmarksHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  folders: Folder[];
  onSmartSearchResults: (results: any[]) => void;
}

export function BookmarksHeader({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  view,
  onViewChange,
  folders,
  onSmartSearchResults,
}: BookmarksHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Bookmark Gallery</h1>
          <Link 
            to="/privacy" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sortOption}
            onValueChange={onSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="bookmarkCount">Bookmark Count</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
          <ViewToggle view={view} onViewChange={onViewChange} />
          <ThemeToggle />
        </div>
      </div>
      <BookmarkSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        folders={folders}
        onSmartSearchResults={onSmartSearchResults}
      />
    </div>
  );
}