import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  const processedFolders: ProcessedFolder[] = [];
  const pinnedBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
    // Check if this is the Bookmarks Bar folder (usually has parentId of "1")
    if (node.id === "1") {
      // Process direct children of the Bookmarks Bar as pinned bookmarks
      node.children?.forEach(child => {
        if (child.url) {
          pinnedBookmarks.push({
            title: child.title,
            url: child.url,
          });
        }
      });
      return;
    }

    if (node.title === 'Other Bookmarks' || node.title === 'Synced Bookmarks') {
      return;
    }

    if (!node.url && node.children) {
      const bookmarks = node.children
        .filter((child) => child.url)
        .map((child) => ({
          title: child.title,
          url: child.url!,
        }));

      processedFolders.push({
        title: node.title,
        bookmarks,
      });
    }

    if (node.children) {
      node.children.forEach(processNode);
    }
  };

  bookmarks.forEach(processNode);
  return { 
    folders: processedFolders, 
    quickAccess: pinnedBookmarks.length > 0 ? pinnedBookmarks : getSamplePinnedBookmarks() 
  };
};

export const getSamplePinnedBookmarks = (): Bookmark[] => [
  { title: "GitHub", url: "https://github.com" },
  { title: "Gmail", url: "https://gmail.com" },
  { title: "Calendar", url: "https://calendar.google.com" },
  { title: "Drive", url: "https://drive.google.com" },
];

export const getSampleData = (): ProcessedFolder[] => [
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