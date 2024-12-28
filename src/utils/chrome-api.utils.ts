import { ChromeBookmark } from "@/types/bookmark.types";

export const getChromeBookmarks = (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(bookmarkTreeNodes);
      });
    } else {
      resolve([]);
    }
  });
};

export const createChromeFolder = (folderName: string): Promise<ChromeBookmark> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.create(
        { 
          parentId: "1", // Bookmarks Bar
          title: folderName.trim() 
        },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(result);
        }
      );
    } else {
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
      chrome.bookmarks.create(
        {
          parentId: folderId,
          url,
          title: title.trim()
        },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(result);
        }
      );
    } else {
      reject(new Error('Chrome API not available'));
    }
  });
};