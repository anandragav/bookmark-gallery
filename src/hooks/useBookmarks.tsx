import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  getChromeBookmarks, 
  removeBookmark as removeBookmarkApi, 
  deleteFolder as deleteFolderApi,
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
      console.log('Fetched bookmarks:', bookmarks);
      const processedData = processBookmarks(bookmarks);
      console.log('Processed bookmarks:', processedData);
      setFolders(processedData.folders);
      setQuickAccessBookmarks(processedData.quickAccess);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookmarks. Please try again.",
        variant: "destructive",
      });
      setFolders([]);
      setQuickAccessBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add Chrome bookmarks event listeners
  useEffect(() => {
    const handleBookmarksUpdate = () => {
      console.log('Bookmarks updated, fetching new data...');
      fetchBookmarks();
    };

    // Listen for both custom event and Chrome API events
    window.addEventListener('bookmarks-updated', handleBookmarksUpdate);
    
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.onCreated.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onRemoved.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onChanged.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onMoved.addListener(handleBookmarksUpdate);
    }

    // Initial fetch
    fetchBookmarks();

    return () => {
      window.removeEventListener('bookmarks-updated', handleBookmarksUpdate);
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.onCreated.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onRemoved.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onChanged.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onMoved.removeListener(handleBookmarksUpdate);
      }
    };
  }, [fetchBookmarks]);

  const moveBookmark = useCallback(async (url: string, fromFolder: string, toFolder: string) => {
    try {
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
  }, [fetchBookmarks, toast]);

  const deleteFolder = useCallback(async (folderTitle: string) => {
    try {
      await deleteFolderApi(folderTitle);
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
    removeBookmark: removeBookmarkApi,
    moveBookmark,
    deleteFolder,
  };
}