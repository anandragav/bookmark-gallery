import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  getChromeBookmarks, 
  removeBookmark, 
  deleteFolder,
  moveBookmark as moveBookmarkApi 
} from "@/utils/chrome-api.utils";
import { ProcessedFolder, Bookmark } from "@/types/bookmark.types";
import { processBookmarks } from "@/utils/bookmark-processor.utils";

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const bookmarks = await getChromeBookmarks();
      const processedFolders = processBookmarks(bookmarks);
      setFolders(processedFolders);
      setQuickAccessBookmarks(processedFolders.flatMap(folder => folder.bookmarks).slice(0, 5));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookmarks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const moveBookmark = useCallback(async (url: string, fromFolder: string, toFolder: string) => {
    try {
      console.log('Moving bookmark:', { url, fromFolder, toFolder });
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        await moveBookmarkApi(url, fromFolder, toFolder);
        await fetchBookmarks();
        toast({
          title: "Success",
          description: "Bookmark moved successfully",
        });
      } else {
        console.log('Development mode: moving bookmark');
        setFolders((currentFolders) => {
          const updatedFolders = [...currentFolders];
          const sourceFolder = updatedFolders.find(f => f.title === fromFolder);
          const targetFolder = updatedFolders.find(f => f.title === toFolder);
          
          if (sourceFolder && targetFolder) {
            const bookmarkToMove = sourceFolder.bookmarks.find(b => b.url === url);
            if (bookmarkToMove) {
              sourceFolder.bookmarks = sourceFolder.bookmarks.filter(b => b.url !== url);
              targetFolder.bookmarks.push(bookmarkToMove);
            }
          }
          
          return updatedFolders;
        });
        toast({
          title: "Success",
          description: "Bookmark moved successfully (Development mode)",
        });
      }
    } catch (error) {
      console.error('Error moving bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to move bookmark. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchBookmarks, setFolders, toast]);

  const deleteFolder = useCallback(async (folderTitle: string) => {
    try {
      await deleteFolder(folderTitle);
      await fetchBookmarks();
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchBookmarks, toast]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    fetchBookmarks,
    removeBookmark,
    moveBookmark,
    deleteFolder,
  };
}
