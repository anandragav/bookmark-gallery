import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createChromeBookmark } from "@/utils/chrome-api.utils";

export function useBookmarkOperations(onSuccess?: () => void) {
  const { toast } = useToast();

  const createBookmark = useCallback(async (folderTitle: string, url: string, title: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.search({ title: folderTitle }, async (results) => {
          if (results.length > 0) {
            const folderId = results[0].id;
            await createChromeBookmark(folderId, url, title);
            toast({
              title: "Success",
              description: "Bookmark created successfully",
            });
            if (onSuccess) {
              onSuccess();
            }
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
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to create bookmark. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, onSuccess]);

  return {
    createBookmark,
  };
}