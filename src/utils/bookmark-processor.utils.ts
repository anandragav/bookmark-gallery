import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  const processedFolders: ProcessedFolder[] = [];
  const frequentBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
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
      
      if (frequentBookmarks.length < 6 && bookmarks.length > 0) {
        frequentBookmarks.push(bookmarks[0]);
      }
    }

    if (node.children) {
      node.children.forEach(processNode);
    }
  };

  bookmarks.forEach(processNode);
  return { folders: processedFolders, quickAccess: frequentBookmarks };
};

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