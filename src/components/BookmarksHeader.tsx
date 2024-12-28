import { Input } from "@/components/ui/input";
import { Search, Magic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "./ViewToggle";
import { ThemeToggle } from "./ThemeToggle";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { BookmarkSearch } from "./BookmarkSearch";
import { Bookmark } from "@/types/bookmark.types";

interface BookmarksHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onFolderCreate: (folderName: string) => void;
  folders: { title: string; bookmarks: Bookmark[] }[];
  onSmartSearchResults: (results: any[]) => void;
  onAutoOrganize: () => void;
  isAutoOrganizing: boolean;
}

export function BookmarksHeader({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  view,
  onViewChange,
  onFolderCreate,
  folders,
  onSmartSearchResults,
  onAutoOrganize,
  isAutoOrganizing,
}: BookmarksHeaderProps) {
  return (
    <header className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Bookmark Gallery</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onAutoOrganize}
            disabled={isAutoOrganizing}
            className="gap-2"
          >
            <Magic className="w-4 h-4" />
            {isAutoOrganizing ? "Organizing..." : "Auto-Organize"}
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
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
            <SelectItem value="recent">Recent First</SelectItem>
          </SelectContent>
        </Select>
        <ViewToggle view={view} onViewChange={onViewChange} />
        <CreateFolderDialog onFolderCreate={onFolderCreate} />
      </div>
    </header>
  );
}