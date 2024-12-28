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