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

export const createChromeFolder = async (folderName: string): Promise<void> => {
  console.log('Creating folder:', folderName);
  
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.error('Chrome API not available for creating folder');
    return;
  }

  return new Promise((resolve, reject) => {
    chrome.bookmarks.create({ title: folderName }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error creating folder:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('Folder created successfully:', result);
        resolve();
      }
    });
  });
};

export const createChromeBookmark = async (folderId: string, url: string, title: string): Promise<void> => {
  console.log('Creating bookmark:', { folderId, url, title });
  
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.error('Chrome API not available for creating bookmark');
    return;
  }

  return new Promise((resolve, reject) => {
    chrome.bookmarks.create({
      parentId: folderId,
      url,
      title
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error creating bookmark:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('Bookmark created successfully:', result);
        resolve();
      }
    });
  });
};

export const removeBookmark = async (url: string, folderTitle: string): Promise<void> => {
  console.log('Attempting to remove bookmark:', { url, folderTitle });
  
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.error('Chrome API not available for removing bookmark');
    return;
  }

  try {
    console.log('Searching for bookmark with URL:', url);
    const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ url }, (results) => {
        console.log('Search results:', results);
        resolve(results);
      });
    });

    const bookmark = bookmarks.find(b => {
      if (!b.parentId) return false;
      return new Promise((resolve) => {
        chrome.bookmarks.get(b.parentId, (folder) => {
          console.log('Found parent folder:', folder);
          resolve(folder[0]?.title === folderTitle);
        });
      });
    });

    if (bookmark) {
      console.log('Found bookmark to remove:', bookmark);
      await new Promise<void>((resolve) => {
        chrome.bookmarks.remove(bookmark.id, () => {
          if (chrome.runtime.lastError) {
            console.error('Error removing bookmark:', chrome.runtime.lastError);
          } else {
            console.log('Bookmark removed successfully');
          }
          resolve();
        });
      });
    } else {
      console.error('Bookmark not found');
    }
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const moveBookmark = async (url: string, fromFolder: string, toFolder: string): Promise<void> => {
  console.log('Moving bookmark:', { url, fromFolder, toFolder });
  
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.error('Chrome API not available for moving bookmark');
    return;
  }

  try {
    // Find the bookmark in the source folder
    const bookmarks = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ url }, (results) => resolve(results));
    });

    // Find the destination folder
    const folders = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ title: toFolder }, (results) => resolve(results));
    });

    const bookmark = bookmarks.find(b => {
      if (!b.parentId) return false;
      return new Promise((resolve) => {
        chrome.bookmarks.get(b.parentId, (folder) => {
          resolve(folder[0]?.title === fromFolder);
        });
      });
    });

    const targetFolder = folders.find(f => !f.url); // folders don't have URLs

    if (bookmark && targetFolder) {
      await new Promise<void>((resolve, reject) => {
        chrome.bookmarks.move(bookmark.id, { parentId: targetFolder.id }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      throw new Error('Bookmark or target folder not found');
    }
  } catch (error) {
    console.error('Error moving bookmark:', error);
    throw error;
  }
};

export const deleteFolder = async (folderTitle: string): Promise<void> => {
  console.log('Attempting to delete folder:', folderTitle);
  
  if (typeof chrome === 'undefined' || !chrome.bookmarks) {
    console.error('Chrome API not available for deleting folder');
    return;
  }

  try {
    console.log('Searching for folder:', folderTitle);
    const folders = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>((resolve) => {
      chrome.bookmarks.search({ title: folderTitle }, (results) => {
        console.log('Search results:', results);
        resolve(results);
      });
    });

    const folder = folders.find(f => !f.url); // folders don't have URLs
    if (folder) {
      console.log('Found folder to delete:', folder);
      await new Promise<void>((resolve) => {
        chrome.bookmarks.removeTree(folder.id, () => {
          if (chrome.runtime.lastError) {
            console.error('Error deleting folder:', chrome.runtime.lastError);
          } else {
            console.log('Folder deleted successfully');
          }
          resolve();
        });
      });
    } else {
      console.error('Folder not found');
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};