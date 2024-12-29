import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createChromeFolder, createChromeBookmark } from "@/utils/chrome-api.utils";

export function useBookmarkOperations(fetchBookmarks: () => Promise<void>) {
  const { toast } = useToast();

  const createFolder = useCallback(async (folderName: string) => {
    try {
      await createChromeFolder(folderName);
      await fetchBookmarks();
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchBookmarks, toast]);

  const createBookmark = useCallback(async (folderTitle: string, url: string, title: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.search({ title: folderTitle }, async (results) => {
          if (results.length > 0) {
            const folderId = results[0].id;
            await createChromeBookmark(folderId, url, title);
            await fetchBookmarks();
            toast({
              title: "Success",
              description: "Bookmark created successfully",
            });
          } else {
            throw new Error('Folder not found');
          }
        });
      } else {
        console.log('Development mode: simulating bookmark creation');
        toast({
          title: "Success",
          description: "Bookmark created successfully (Development mode)",
        });
      }
    } catch (error) {
      console.error('Error creating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to create bookmark. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchBookmarks, toast]);

  return {
    createFolder,
    createBookmark,
  };
}