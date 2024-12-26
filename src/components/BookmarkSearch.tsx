import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookmarkSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BookmarkSearch({ searchQuery, onSearchChange }: BookmarkSearchProps) {
  return (
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
  );
}