import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processBookmarks } from "@/lib/bookmarkProcessing";
import { createChromeBookmark, createDevBookmark } from "@/lib/bookmarkCreation";
import { fetchChromeBookmarks, fetchDevBookmarks } from "@/lib/bookmarkFetching";
import { Bookmark, ProcessedFolder } from "@/types/bookmarks";

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
        const bookmarkTreeNodes = await fetchChromeBookmarks();
        const { folders: processedFolders, quickAccess } = processBookmarks(bookmarkTreeNodes);
        setFolders(processedFolders);
        setQuickAccessBookmarks(quickAccess);
      } else {
        console.log('Using development sample data');
        const { folders: devFolders, quickAccess } = await fetchDevBookmarks();
        setFolders(devFolders);
        setQuickAccessBookmarks(quickAccess);
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

  const createBookmark = useCallback(async (folderTitle: string, url: string, title: string) => {
    console.log('Creating bookmark:', { folderTitle, url, title });
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        await createChromeBookmark(folderTitle, url, title);
      } else {
        createDevBookmark(folders, setFolders, folderTitle, url, title);
      }
      toast({
        title: "Success",
        description: "Bookmark created successfully",
      });
      await fetchBookmarks();
    } catch (error) {
      console.error('Error creating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to create bookmark. Please try again.",
        variant: "destructive",
      });
    }
  }, [folders, fetchBookmarks, toast]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    refreshBookmarks: fetchBookmarks,
    createBookmark,
  };
}