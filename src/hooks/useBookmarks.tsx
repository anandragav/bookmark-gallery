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

  // Load bookmarks from Chrome API
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        // Check if chrome.bookmarks is available
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          const tree = await chrome.bookmarks.getTree();
          const processedFolders: ProcessedFolder[] = [];
          
          // Process bookmark tree
          const processNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
            // Skip root folders and empty folders
            if (node.children && node.title && node.id !== "0" && node.id !== "1") {
              const bookmarks: Bookmark[] = [];
              
              // Collect bookmarks from this folder
              node.children.forEach(child => {
                if (child.url) {
                  bookmarks.push({
                    title: child.title,
                    url: child.url
                  });
                }
              });

              // Only add folders that have bookmarks
              if (bookmarks.length > 0) {
                processedFolders.push({
                  id: node.id,
                  title: node.title,
                  bookmarks: bookmarks
                });
              }
            }
            
            // Process subfolders
            if (node.children) {
              node.children.forEach(processNode);
            }
          };

          // Process the entire tree
          tree[0].children?.forEach(processNode);
          setFolders(processedFolders);
          console.log('Loaded folders:', processedFolders);
        } else {
          console.warn('Chrome bookmarks API not available');
          toast({
            title: "Warning",
            description: "Chrome bookmarks API not available. Are you running this as a Chrome extension?",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        toast({
          title: "Error",
          description: "Failed to load bookmarks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [toast]);

  const createFolder = useCallback(async (folderName: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        const newFolder = await chrome.bookmarks.create({
          title: folderName,
          parentId: "1" // Create in the bookmarks bar
        });
        
        setFolders(prev => [...prev, {
          id: newFolder.id,
          title: newFolder.title,
          bookmarks: []
        }]);

        toast({
          title: "Success",
          description: "Folder created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  }, [toast]);

  const addBookmarkToFolder = useCallback(async (folderId: string, bookmark: Bookmark) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        const newBookmark = await chrome.bookmarks.create({
          parentId: folderId,
          title: bookmark.title,
          url: bookmark.url
        });

        setFolders(prev => prev.map(folder => {
          if (folder.id === folderId) {
            return {
              ...folder,
              bookmarks: [...folder.bookmarks, bookmark]
            };
          }
          return folder;
        }));

        toast({
          title: "Success",
          description: "Bookmark added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to add bookmark",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    createFolder,
    addBookmarkToFolder
  };
}