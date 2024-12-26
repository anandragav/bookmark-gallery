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

interface BookmarksHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function BookmarksHeader({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  view,
  onViewChange,
}: BookmarksHeaderProps) {
  return (
    <header className="text-center mb-16">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
        Bookmarks Gallery
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Your bookmarks, beautifully organized in an elegant gallery view
      </p>
      <div className="flex items-center gap-4 max-w-md mx-auto mt-8">
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
      </div>
    </header>
  );
}