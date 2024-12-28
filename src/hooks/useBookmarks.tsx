import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Bookmark {
  title: string;
  url: string;
}

interface ProcessedFolder {
  title: string;
  thumbnailUrl?: string;
  bookmarks: Bookmark[];
}

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      console.log('Fetching bookmarks...'); // Debug log

      try {
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          console.log('Chrome bookmarks API is available'); // Debug log
          
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            console.log('Bookmark tree received:', bookmarkTreeNodes); // Debug log

            const processedFolders: ProcessedFolder[] = [];
            const quickAccess: Bookmark[] = [];

            const processNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
              console.log('Processing node:', node); // Debug log

              // Skip root folders and empty folders
              if (!node.url && node.children && node.title && node.id !== "0" && node.id !== "1" && node.id !== "2") {
                const bookmarks = node.children
                  .filter(child => child.url)
                  .map(child => ({
                    title: child.title,
                    url: child.url!
                  }));

                if (bookmarks.length > 0) {
                  processedFolders.push({
                    title: node.title,
                    bookmarks
                  });

                  // Add first bookmark from each folder to quick access
                  if (quickAccess.length < 6) {
                    quickAccess.push(bookmarks[0]);
                  }
                }
              }

              // Process children recursively
              if (node.children) {
                node.children.forEach(processNode);
              }
            };

            bookmarkTreeNodes.forEach(processNode);
            
            console.log('Processed folders:', processedFolders); // Debug log
            setFolders(processedFolders);
            setQuickAccessBookmarks(quickAccess);
            setIsLoading(false);

            // Show success toast if folders were found
            if (processedFolders.length > 0) {
              toast({
                title: "Bookmarks Loaded",
                description: `Found ${processedFolders.length} bookmark folders`,
              });
            } else {
              toast({
                title: "No Bookmarks Found",
                description: "No bookmark folders were found in your browser",
                variant: "destructive",
              });
            }
          });
        } else {
          console.log('Chrome bookmarks API not available, using sample data'); // Debug log
          // Sample data for development
          const sampleFolders: ProcessedFolder[] = [
            {
              title: "Development Resources",
              bookmarks: [
                { title: "GitHub", url: "https://github.com" },
                { title: "Stack Overflow", url: "https://stackoverflow.com" },
              ],
            },
            {
              title: "Social Media",
              bookmarks: [
                { title: "Twitter", url: "https://twitter.com" },
                { title: "LinkedIn", url: "https://linkedin.com" },
              ],
            },
          ];
          setFolders(sampleFolders);
          setQuickAccessBookmarks(sampleFolders[0].bookmarks.slice(0, 3));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error); // Debug log
        toast({
          title: "Error",
          description: "Failed to load bookmarks. Please check the console for details.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [toast]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks
  };
}