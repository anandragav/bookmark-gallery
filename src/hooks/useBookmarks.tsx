import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  getChromeBookmarks, 
  removeBookmark as removeBookmarkApi,
  moveBookmark as moveBookmarkApi
} from "@/utils/chrome-api.utils";
import { ProcessedFolder, Bookmark } from "@/types/bookmark.types";
import { processBookmarks } from "@/utils/bookmark-processor.utils";

const mockFolders: ProcessedFolder[] = [
  {
    title: "Development",
    bookmarks: [
      { title: "GitHub", url: "https://github.com" },
      { title: "Stack Overflow", url: "https://stackoverflow.com" },
      { title: "MDN Web Docs", url: "https://developer.mozilla.org" }
    ]
  },
  {
    title: "Social Media",
    bookmarks: [
      { title: "Twitter", url: "https://twitter.com" },
      { title: "LinkedIn", url: "https://linkedin.com" },
      { title: "Instagram", url: "https://instagram.com" }
    ]
  },
  {
    title: "News",
    bookmarks: [
      { title: "TechCrunch", url: "https://techcrunch.com" },
      { title: "The Verge", url: "https://theverge.com" },
      { title: "Hacker News", url: "https://news.ycombinator.com" }
    ]
  }
];

export function useBookmarks() {
  const [folders, setFolders] = useState<ProcessedFolder[]>(mockFolders);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        const bookmarks = await getChromeBookmarks();
        console.log('Fetched bookmarks:', bookmarks);
        const processedData = processBookmarks(bookmarks);
        console.log('Processed bookmarks:', processedData);
        setFolders(processedData.folders);
        setQuickAccessBookmarks(processedData.quickAccess);
      } else {
        console.log('Development mode: using mock folders');
        setFolders(mockFolders);
        setQuickAccessBookmarks([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookmarks. Please try again.",
        variant: "destructive",
      });
      setFolders(mockFolders);
      setQuickAccessBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const handleBookmarksUpdate = () => {
      console.log('Bookmarks updated, fetching new data...');
      fetchBookmarks();
    };

    window.addEventListener('bookmarks-updated', handleBookmarksUpdate);
    
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.onCreated.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onRemoved.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onChanged.addListener(handleBookmarksUpdate);
      chrome.bookmarks.onMoved.addListener(handleBookmarksUpdate);
    }

    fetchBookmarks();

    return () => {
      window.removeEventListener('bookmarks-updated', handleBookmarksUpdate);
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.onCreated.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onRemoved.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onChanged.removeListener(handleBookmarksUpdate);
        chrome.bookmarks.onMoved.removeListener(handleBookmarksUpdate);
      }
    };
  }, [fetchBookmarks]);

  return {
    folders,
    isLoading,
    quickAccessBookmarks,
    fetchBookmarks,
    removeBookmark: removeBookmarkApi,
    moveBookmark: moveBookmarkApi,
  };
}