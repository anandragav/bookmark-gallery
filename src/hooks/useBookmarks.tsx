import { useState, useEffect, useCallback } from "react";
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

interface ChromeBookmark {
  id: string;
  title: string;
  url?: string;
  children?: ChromeBookmark[];
}

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  const processBookmarks = useCallback((bookmarks: ChromeBookmark[]) => {
    console.log('Processing bookmarks:', bookmarks); // Debug log
    const processedFolders: ProcessedFolder[] = [];
    const frequentBookmarks: Bookmark[] = [];

    const processNode = (node: ChromeBookmark) => {
      console.log('Processing node:', node.title); // Debug log
      
      // Skip special Chrome folders
      if (node.title === 'Other Bookmarks' || node.title === 'Synced Bookmarks') {
        console.log('Skipping special folder:', node.title);
        return;
      }

      if (!node.url && node.children) {
        const bookmarks = node.children
          .filter((child) => child.url)
          .map((child) => ({
            title: child.title,
            url: child.url!,
          }));

        if (bookmarks.length > 0) {
          console.log('Found folder with bookmarks:', node.title, bookmarks.length);
          processedFolders.push({
            title: node.title,
            bookmarks,
          });
          
          // Add first bookmark from each folder to quick access
          if (frequentBookmarks.length < 6) {
            frequentBookmarks.push(bookmarks[0]);
          }
        }
      }

      if (node.children) {
        node.children.forEach(processNode);
      }
    };

    bookmarks.forEach(processNode);
    console.log('Processed folders:', processedFolders.length);
    return { folders: processedFolders, quickAccess: frequentBookmarks };
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        console.log('Checking Chrome API availability...'); // Debug log
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          console.log('Chrome Bookmarks API is available');
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            console.log('Got bookmark tree:', bookmarkTreeNodes); // Debug log
            if (chrome.runtime.lastError) {
              console.error('Chrome API error:', chrome.runtime.lastError);
              toast({
                title: "Error",
                description: "Failed to load bookmarks: " + chrome.runtime.lastError.message,
                variant: "destructive",
              });
              return;
            }
            const { folders, quickAccess } = processBookmarks(bookmarkTreeNodes);
            setFolders(folders);
            setQuickAccessBookmarks(quickAccess);
            setIsLoading(false);
          });
        } else {
          console.log('Using development sample data');
          // Sample data for development
          const sampleFolders: ProcessedFolder[] = [
            {
              title: "Development Resources",
              bookmarks: [
                { title: "GitHub", url: "https://github.com" },
                { title: "Stack Overflow", url: "https://stackoverflow.com" },
                { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
              ],
            },
            {
              title: "Social Media",
              bookmarks: [
                { title: "Twitter", url: "https://twitter.com" },
                { title: "LinkedIn", url: "https://linkedin.com" },
                { title: "Facebook", url: "https://facebook.com" },
              ],
            },
          ];
          setFolders(sampleFolders);
          setQuickAccessBookmarks(sampleFolders[0].bookmarks.slice(0, 3));
          setTimeout(() => setIsLoading(false), 1000);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load bookmarks. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchBookmarks();
  }, [processBookmarks, toast]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks
  };
}