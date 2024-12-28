import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Bookmark {
  title: string;
  url: string;
}

interface ProcessedFolder {
  id: string;
  title: string;
  thumbnailUrl?: string;
  bookmarks: Bookmark[];
}

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  const createFolder = useCallback((folderName: string) => {
    const newFolder: ProcessedFolder = {
      id: Date.now().toString(),
      title: folderName,
      bookmarks: []
    };
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const addBookmarkToFolder = useCallback((folderId: string, bookmark: Bookmark) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          bookmarks: [...folder.bookmarks, bookmark]
        };
      }
      return folder;
    }));

    // Update quick access if needed
    setQuickAccessBookmarks(prev => {
      if (prev.length < 6) {
        return [...prev, bookmark];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Initialize with empty state
    setIsLoading(false);
  }, []);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    createFolder,
    addBookmarkToFolder
  };
}