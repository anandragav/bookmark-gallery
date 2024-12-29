import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  const processedFolders: ProcessedFolder[] = [];
  const pinnedBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
    // Process Bookmarks Bar items
    if (node.parentId === "1") {
      // If it's a direct URL bookmark in the Bookmarks Bar, add to quick access
      if (node.url) {
        pinnedBookmarks.push({
          title: node.title,
          url: node.url,
        });
      }
      // If it's a folder in the Bookmarks Bar, process it
      else if (node.children) {
        const bookmarks = node.children
          .filter(child => child.url) // Only include items with URLs (actual bookmarks)
          .map(child => ({
            title: child.title,
            url: child.url!,
          }));

        if (bookmarks.length > 0) {
          processedFolders.push({
            title: node.title,
            bookmarks,
          });
        }
      }
    }

    // Recursively process children
    if (node.children) {
      node.children.forEach(processNode);
    }
  };

  // Start processing from the Bookmarks Bar
  const bookmarksBar = bookmarks[0]?.children?.find(node => node.title === "Bookmarks Bar");
  if (bookmarksBar?.children) {
    bookmarksBar.children.forEach(processNode);
  }

  console.log('Processed folders:', processedFolders);
  console.log('Processed bookmarks:', { folders: processedFolders, quickAccess: pinnedBookmarks });

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