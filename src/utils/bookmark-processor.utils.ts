import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  const processedFolders: ProcessedFolder[] = [];
  const pinnedBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
    if (node.children) {
      // Process direct bookmarks in the Bookmarks Bar
      const directBookmarks = node.children
        .filter(child => child.url)
        .map(child => ({
          title: child.title,
          url: child.url!,
        }));

      if (directBookmarks.length > 0) {
        processedFolders.push({
          title: "Bookmarks Bar",
          bookmarks: directBookmarks,
        });
        pinnedBookmarks.push(...directBookmarks.slice(0, 6));
      }

      // Process folders in the Bookmarks Bar
      node.children
        .filter(child => !child.url && child.children)
        .forEach(folder => {
          const bookmarks = folder.children
            ?.filter(child => child.url)
            .map(child => ({
              title: child.title,
              url: child.url!,
            })) || [];

          if (bookmarks.length > 0) {
            processedFolders.push({
              title: folder.title,
              bookmarks,
            });
          }
        });
    }
  };

  // Start processing from the root
  const bookmarksBar = bookmarks[0]?.children?.find(node => node.title === "Bookmarks Bar");
  if (bookmarksBar) {
    processNode(bookmarksBar);
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