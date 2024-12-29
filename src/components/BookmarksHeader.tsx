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
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useBookmarkOperations } from "@/hooks/useBookmarkOperations";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [newFolderName, setNewFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createFolder } = useBookmarkOperations(() => {
    // Close dialog and reset input after successful creation
    setIsDialogOpen(false);
    setNewFolderName("");
    // Note: removed window.location.reload() as it's not needed
  });

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim());
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new bookmark folder.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
              />
              <Button onClick={handleCreateFolder}>
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}