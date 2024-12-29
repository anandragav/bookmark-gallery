import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewToggle } from "./ViewToggle";
import { ThemeToggle } from "./ThemeToggle";
import { BookmarkSearch } from "./BookmarkSearch";
import { Bookmark } from "@/types/bookmark.types";

interface BookmarksHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  folders: { title: string; bookmarks: Bookmark[] }[];
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
    <header className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Better Bookmarks
        </h1>
        <ThemeToggle />
      </div>
      <p className="text-lg text-muted-foreground mb-8 text-left">
        Your bookmarks, beautifully organized in an elegant gallery view
      </p>
      <div className="flex items-center gap-4">
        <BookmarkSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          folders={folders}
          onSmartSearchResults={onSmartSearchResults}
        />
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
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </header>
  );
}