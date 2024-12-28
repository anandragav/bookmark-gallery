import { useState } from "react";
import { ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export function useBookmarksState() {
  const [folders, setFolders] = useState<ProcessedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccessBookmarks, setQuickAccessBookmarks] = useState<Bookmark[]>([]);

  return {
    folders,
    setFolders,
    isLoading,
    setIsLoading,
    quickAccessBookmarks,
    setQuickAccessBookmarks,
  };
}