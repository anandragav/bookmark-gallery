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
  
  // Process any node that has children and is not a bookmark
  if (node.children && !node.url) {
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
  }
  
  // Recursively process child folders
  if (node.children) {
    node.children
      .filter(child => child.children && !child.url)
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

  // Process all root nodes and their children
  bookmarks.forEach(rootNode => {
    processedFolders.push(...processFolderNode(rootNode));
  });

  // Find the Bookmarks Bar for quick access items
  const bookmarksBar = bookmarks[0]?.children?.find(node => node.title === "Bookmarks Bar");
  
  if (bookmarksBar) {
    console.log('Found Bookmarks Bar:', bookmarksBar);
    
    // Process direct bookmarks in the Bookmarks Bar
    const directBookmarks = bookmarksBar.children
      ?.filter(child => child.url)
      .map(child => ({
        title: child.title,
        url: child.url!,
      })) || [];

    if (directBookmarks.length > 0) {
      processedFolders.push({
        title: "Bookmarks Bar",
        bookmarks: directBookmarks,
      });
      pinnedBookmarks.push(...directBookmarks.slice(0, 6));
    }

    // Process folders in the Bookmarks Bar
    if (bookmarksBar.children) {
      bookmarksBar.children
        .filter(child => child.children && !child.url)
        .forEach(folder => {
          processedFolders.push(...processFolderNode(folder));
        });
    }
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