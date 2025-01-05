import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmark.types";

const processBookmarkNode = (node: ChromeBookmark): Bookmark[] => {
  const bookmarks: Bookmark[] = [];
  
  if (node.url) {
    bookmarks.push({
      title: node.title,
      url: node.url,
    });
  }
  
  if (node.children) {
    node.children.forEach(child => {
      bookmarks.push(...processBookmarkNode(child));
    });
  }
  
  return bookmarks;
};

const processFolderNode = (node: ChromeBookmark): ProcessedFolder[] => {
  const folders: ProcessedFolder[] = [];
  
  // Process this node if it has children (whether it's a root node or nested folder)
  if (node.children) {
    const bookmarks = node.children
      .filter(child => child.url)
      .map(child => ({
        title: child.title,
        url: child.url!,
      }));

    if (bookmarks.length > 0) {
      folders.push({
        title: node.title,
        bookmarks,
      });
    }

    // Process child folders
    node.children
      .filter(child => child.children)
      .forEach(childFolder => {
        folders.push(...processFolderNode(childFolder));
      });
  }
  
  return folders;
};

export const processBookmarks = (bookmarks: ChromeBookmark[]): {
  folders: ProcessedFolder[];
  quickAccess: Bookmark[];
} => {
  console.log('Processing bookmarks:', bookmarks);
  const processedFolders: ProcessedFolder[] = [];
  const pinnedBookmarks: Bookmark[] = [];

  // Process all nodes including root nodes
  bookmarks.forEach(rootNode => {
    if (rootNode.children) {
      // Process root level folders
      rootNode.children
        .filter(child => child.children)
        .forEach(folder => {
          processedFolders.push(...processFolderNode(folder));
        });
    }
  });

  // Find and process the Bookmarks Bar
  const bookmarksBar = bookmarks[0]?.children?.find(node => node.title === "Bookmarks Bar");
  
  if (bookmarksBar?.children) {
    // Get direct bookmarks from the Bookmarks Bar
    const directBookmarks = bookmarksBar.children
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

    // Process folders within the Bookmarks Bar
    bookmarksBar.children
      .filter(child => child.children && !child.url)
      .forEach(folder => {
        processedFolders.push(...processFolderNode(folder));
      });
  }

  console.log('Processed folders:', processedFolders);
  console.log('Quick access bookmarks:', pinnedBookmarks);

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