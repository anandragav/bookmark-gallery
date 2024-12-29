import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  const processedFolders: ProcessedFolder[] = [];
  const pinnedBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
    // Skip root node processing
    if (!node.parentId && node.children) {
      node.children.forEach(processNode);
      return;
    }

    // Process Bookmarks Bar items as quick access
    if (node.parentId === "1" && node.url) {
      pinnedBookmarks.push({
        title: node.title,
        url: node.url,
      });
      return;
    }

    // Process folders (nodes with children but no URL)
    if (!node.url && node.children && node.title !== "Bookmarks Bar") {
      const bookmarks = node.children
        .filter(child => child.url)
        .map(child => ({
          title: child.title,
          url: child.url!,
        }));

      if (bookmarks.length > 0 || node.children.length > 0) {
        processedFolders.push({
          title: node.title,
          bookmarks,
        });
      }

      // Process subfolders
      node.children
        .filter(child => !child.url && child.children)
        .forEach(processNode);
    }
  };

  // Start processing from the root nodes
  bookmarks.forEach(processNode);

  console.log('Processed folders:', processedFolders);
  
  return {
    folders: processedFolders,
    quickAccess: pinnedBookmarks.length > 0 ? pinnedBookmarks : getSamplePinnedBookmarks(),
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
    title: "Development",
    bookmarks: [
      { title: "GitHub", url: "https://github.com" },
      { title: "Stack Overflow", url: "https://stackoverflow.com" },
    ],
  },
  {
    title: "Social",
    bookmarks: [
      { title: "Twitter", url: "https://twitter.com" },
      { title: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
];