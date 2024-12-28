import { ChromeBookmark, ProcessedFolder, Bookmark } from "@/types/bookmarks";

export function processBookmarks(bookmarks: ChromeBookmark[]) {
  console.log('Processing bookmarks:', bookmarks);
  const processedFolders: ProcessedFolder[] = [];
  const frequentBookmarks: Bookmark[] = [];

  const processNode = (node: ChromeBookmark) => {
    console.log('Processing node:', node.title);
    
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
  console.log('Processed folders:', processedFolders.length);
  return { folders: processedFolders, quickAccess: frequentBookmarks };
}