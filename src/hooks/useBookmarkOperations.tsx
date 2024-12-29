import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createChromeFolder, createChromeBookmark } from "@/utils/chrome-api.utils";

export function useBookmarkOperations(onSuccess?: () => void) {
  const { toast } = useToast();

  const createFolder = useCallback(async (folderName: string) => {
    try {
      if (!folderName.trim()) {
        toast({
          title: "Error",
          description: "Folder name cannot be empty",
          variant: "destructive",
        });
        return;
      }
      
      const result = await createChromeFolder(folderName.trim());
      console.log('Folder creation result:', result);
      
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, onSuccess]);

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
    createFolder,
    createBookmark,
  };
}