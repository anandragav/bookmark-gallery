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

// Initial data to populate when no bookmarks exist
const initialFolders: ProcessedFolder[] = [
  {
    id: "1",
    title: "Development",
    bookmarks: [
      {
        title: "GitHub",
        url: "https://github.com"
      },
      {
        title: "Stack Overflow",
        url: "https://stackoverflow.com"
      }
    ]
  },
  {
    id: "2",
    title: "Social Media",
    bookmarks: [
      {
        title: "Twitter",
        url: "https://twitter.com"
      },
      {
        title: "LinkedIn",
        url: "https://linkedin.com"
      }
    ]
  }
];

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  // Load folders from localStorage on mount
  useEffect(() => {
    const savedFolders = localStorage.getItem('bookmarkFolders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Initialize with default folders if no data exists
      setFolders(initialFolders);
      localStorage.setItem('bookmarkFolders', JSON.stringify(initialFolders));
    }
    setIsLoading(false);
  }, []);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkFolders', JSON.stringify(folders));
  }, [folders]);

  const createFolder = useCallback((folderName: string) => {
    const newFolder: ProcessedFolder = {
      id: Date.now().toString(),
      title: folderName,
      bookmarks: []
    };
    setFolders(prev => [...prev, newFolder]);
    
    toast({
      title: "Folder Created",
      description: `Created new folder: ${folderName}`,
    });
  }, [toast]);

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

    toast({
      title: "Bookmark Added",
      description: `Added bookmark: ${bookmark.title}`,
    });
  }, [toast]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    createFolder,
    addBookmarkToFolder
  };
}