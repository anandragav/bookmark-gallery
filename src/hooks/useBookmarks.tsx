import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProcessedFolder, Bookmark } from "@/types/bookmark.types";
import { getChromeBookmarks, removeBookmark as removeBookmarkApi, moveBookmark as moveBookmarkApi } from "@/utils/chrome-api.utils";
import { processBookmarks, getSampleData } from "@/utils/bookmark-processor.utils";
import { useBookmarksState } from "./useBookmarksState";
import { useBookmarkOperations } from "./useBookmarkOperations";

export function useBookmarks() {
  const { 
    folders, 
    setFolders, 
    isLoading, 
    setIsLoading, 
    quickAccessBookmarks, 
    setQuickAccessBookmarks 
  } = useBookmarksState();
  
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Checking Chrome API availability...');
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        console.log('Chrome Bookmarks API is available');
        const bookmarkTreeNodes = await getChromeBookmarks();
        console.log('Got bookmark tree:', bookmarkTreeNodes);
        const { folders: processedFolders, quickAccess } = processBookmarks(bookmarkTreeNodes);
        setFolders(processedFolders);
        setQuickAccessBookmarks(quickAccess);
      } else {
        console.log('Using development sample data');
        const sampleFolders = getSampleData();
        setFolders(sampleFolders);
        setQuickAccessBookmarks([
          { title: "GitHub", url: "https://github.com" },
          { title: "Gmail", url: "https://gmail.com" },
          { title: "Calendar", url: "https://calendar.google.com" },
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, setFolders, setIsLoading, setQuickAccessBookmarks]);

  const { createFolder, createBookmark } = useBookmarkOperations(fetchBookmarks);

  const removeBookmark = useCallback(async (url: string, folderTitle: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        await removeBookmarkApi(url, folderTitle);
        await fetchBookmarks();
        toast({
          title: "Success",
          description: "Bookmark removed successfully",
        });
      } else {
        setFolders((currentFolders) => 
          currentFolders.map((folder) => {
            if (folder.title === folderTitle) {
              return {
                ...folder,
                bookmarks: folder.bookmarks.filter((b) => b.url !== url),
              };
            }
            return folder;
          })
        );
        toast({
          title: "Success",
          description: "Bookmark removed successfully (Development mode)",
        });
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchBookmarks, setFolders, toast]);

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
        setFolders((currentFolders) => {
          const bookmark = currentFolders
            .find((f) => f.title === fromFolder)
            ?.bookmarks.find((b) => b.url === url);

          if (!bookmark) return currentFolders;

          return currentFolders.map((folder) => {
            if (folder.title === fromFolder) {
              return {
                ...folder,
                bookmarks: folder.bookmarks.filter((b) => b.url !== url),
              };
            }
            if (folder.title === toFolder) {
              return {
                ...folder,
                bookmarks: [...folder.bookmarks, bookmark],
              };
            }
            return folder;
          });
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

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    refreshBookmarks: fetchBookmarks,
    createFolder,
    createBookmark,
    removeBookmark,
    moveBookmark,
  };
}