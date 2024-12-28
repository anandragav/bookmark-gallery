import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewToggle } from "./ViewToggle";
import { ThemeToggle } from "./ThemeToggle";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface BookmarksHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onFolderCreate: (folderName: string) => void;
}

export function BookmarksHeader({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  view,
  onViewChange,
  onFolderCreate,
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
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
        <CreateFolderDialog onFolderCreate={onFolderCreate} />
      </div>
    </header>
  );
}