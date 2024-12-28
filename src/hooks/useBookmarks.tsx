import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProcessedFolder, Bookmark } from "@/types/bookmark.types";
import { getChromeBookmarks, createChromeFolder, createChromeBookmark } from "@/utils/chrome-api.utils";
import { processBookmarks, getSampleData } from "@/utils/bookmark-processor.utils";

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Checking Chrome API availability...');
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        console.log('Chrome Bookmarks API is available');
        const bookmarkTreeNodes = await getChromeBookmarks();
        console.log('Got bookmark tree:', bookmarkTreeNodes);
        const { folders, quickAccess } = processBookmarks(bookmarkTreeNodes);
        setFolders(folders);
        setQuickAccessBookmarks(quickAccess);
      } else {
        console.log('Using development sample data');
        const sampleFolders = getSampleData();
        setFolders(sampleFolders);
        setQuickAccessBookmarks([
          { title: "GitHub", url: "https://github.com" },
          { title: "Twitter", url: "https://twitter.com" },
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
  }, [toast]);

  const createFolder = useCallback(async (folderName: string) => {
    console.log('Creating folder:', folderName);
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        await createChromeFolder(folderName);
        await fetchBookmarks();
        toast({
          title: "Success",
          description: "Folder created successfully",
        });
      } else {
        setFolders((currentFolders) => [
          ...currentFolders,
          {
            title: folderName,
            bookmarks: [],
          },
        ]);
        toast({
          title: "Success",
          description: "Folder created successfully (Development mode)",
        });
      }
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
        // Find the folder ID
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
        setFolders((currentFolders) => 
          currentFolders.map((folder) => {
            if (folder.title === folderTitle) {
              return {
                ...folder,
                bookmarks: [...folder.bookmarks, { title, url }],
              };
            }
            return folder;
          })
        );
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

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    refreshBookmarks: fetchBookmarks,
    createFolder,
    createBookmark,
  };
}