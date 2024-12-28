import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sun, Search, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewToggle } from "@/components/ViewToggle";
import { BookmarksGrid } from "@/components/BookmarksGrid";
import { QuickAccess } from "@/components/QuickAccess";
import { useBookmarks } from "@/hooks/useBookmarks";

const Index = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const { folders, isLoading, quickAccessBookmarks } = useBookmarks();

  const filteredFolders = folders.filter(folder => 
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.bookmarks.some(bookmark => 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <TooltipProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Better Bookmarks</h1>
              <p className="text-muted-foreground mt-2">
                Your bookmarks, beautifully organized in an elegant gallery view
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <ViewToggle view={view} onViewChange={setView} />
                <Button>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
            </div>

            <QuickAccess bookmarks={quickAccessBookmarks} />
            
            <BookmarksGrid 
              folders={filteredFolders}
              view={view}
              isLoading={isLoading}
            />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Index;