import { ChromeBookmark } from "@/types/bookmark.types";

export const getChromeBookmarks = (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      console.log('Fetching Chrome bookmarks...');
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome API error:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
          return;
        }
        console.log('Chrome bookmarks fetched:', bookmarkTreeNodes);
        resolve(bookmarkTreeNodes);
      });
    } else {
      console.log('Chrome API not available, resolving empty array');
      resolve([]);
    }
  });
};

export const createChromeFolder = (folderName: string): Promise<ChromeBookmark> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      console.log('Creating Chrome folder:', folderName);
      // Use "1" as parentId which represents the Bookmarks Bar
      chrome.bookmarks.create(
        { 
          parentId: "1",
          title: folderName.trim() 
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome API error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          console.log('Chrome folder created:', result);
          resolve(result);
        }
      );
    } else {
      console.log('Chrome API not available');
      reject(new Error('Chrome API not available'));
    }
  });
};

export const createChromeBookmark = (
  folderId: string,
  url: string,
  title: string
): Promise<ChromeBookmark> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      console.log('Creating Chrome bookmark:', { folderId, url, title });
      chrome.bookmarks.create(
        {
          parentId: folderId,
          url,
          title: title.trim()
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome API error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          console.log('Chrome bookmark created:', result);
          resolve(result);
        }
      );
    } else {
      console.log('Chrome API not available');
      reject(new Error('Chrome API not available'));
    }
  });
};

export const removeBookmark = async (url: string, folderTitle: string): Promise<void> => {
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.log('Chrome API not available');
    return;
  }

  try {
    const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ url }, (results) => resolve(results));
    });

    const bookmark = bookmarks.find(b => {
      if (!b.parentId) return false;
      return new Promise((resolve) => {
        chrome.bookmarks.get(b.parentId, (folder) => {
          resolve(folder[0]?.title === folderTitle);
        });
      });
    });

    if (bookmark) {
      await new Promise<void>((resolve) => {
        chrome.bookmarks.remove(bookmark.id, () => resolve());
      });
    }
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const deleteFolder = async (folderTitle: string): Promise<void> => {
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.log('Chrome API not available');
    return;
  }

  try {
    const folders = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ title: folderTitle }, (results) => resolve(results));
    });

    const folder = folders.find(f => !f.url); // folders don't have URLs
    if (folder) {
      await new Promise<void>((resolve) => {
        chrome.bookmarks.removeTree(folder.id, () => resolve());
      });
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

export const moveBookmark = async (
  url: string,
  fromFolderTitle: string,
  toFolderTitle: string
): Promise<void> => {
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.log('Chrome API not available');
    return;
  }

  try {
    // Find the bookmark in the source folder
    const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ url }, (results) => resolve(results));
    });

    const bookmark = bookmarks.find(b => {
      if (!b.parentId) return false;
      return new Promise((resolve) => {
        chrome.bookmarks.get(b.parentId, (folder) => {
          resolve(folder[0]?.title === fromFolderTitle);
        });
      });
    });

    if (!bookmark) {
      throw new Error('Bookmark not found in source folder');
    }

    // Find the destination folder
    const folders = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ title: toFolderTitle }, (results) => resolve(results));
    });

    const targetFolder = folders.find(f => !f.url);
    if (!targetFolder) {
      throw new Error('Target folder not found');
    }

    // Move the bookmark
    await new Promise<void>((resolve) => {
      chrome.bookmarks.move(bookmark.id, { parentId: targetFolder.id }, () => resolve());
    });
  } catch (error) {
    console.error('Error moving bookmark:', error);
    throw error;
  }
};
