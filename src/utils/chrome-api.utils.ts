import { ChromeBookmark } from "@/types/bookmark.types";

const isDevelopment = process.env.NODE_ENV === 'development';

export const getChromeBookmarks = async (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log('Chrome API returned bookmarks:', bookmarkTreeNodes);
        resolve(bookmarkTreeNodes);
      });
    } else {
      console.log('Development mode: returning sample bookmarks');
      resolve([{
        id: "0",
        title: "root",
        children: [{
          id: "1",
          title: "Bookmarks Bar",
          parentId: "0",
          children: [
            {
              id: "2",
              parentId: "1",
              title: "Development",
              children: [
                {
                  id: "3",
                  parentId: "2",
                  title: "GitHub",
                  url: "https://github.com"
                },
                {
                  id: "4",
                  parentId: "2",
                  title: "Stack Overflow",
                  url: "https://stackoverflow.com"
                }
              ]
            },
            {
              id: "5",
              parentId: "1",
              title: "Social",
              children: [
                {
                  id: "6",
                  parentId: "5",
                  title: "Twitter",
                  url: "https://twitter.com"
                },
                {
                  id: "7",
                  parentId: "5",
                  title: "LinkedIn",
                  url: "https://linkedin.com"
                }
              ]
            }
          ]
        }]
      }]);
    }
  });
};

export const removeBookmark = async (url: string) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.search({ url }, (results) => {
        if (results.length > 0) {
          chrome.bookmarks.remove(results[0].id, () => {
            resolve(true);
          });
        } else {
          reject(new Error('Bookmark not found'));
        }
      });
    } else {
      console.log('Development mode: simulating bookmark removal');
      resolve(true);
    }
  });
};

export const moveBookmark = async (url: string, fromFolder: string, toFolder: string) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.search({ url }, (results) => {
        if (results.length === 0) {
          reject(new Error('Bookmark not found'));
          return;
        }

        chrome.bookmarks.search({ title: toFolder }, (folders) => {
          if (folders.length === 0) {
            reject(new Error('Target folder not found'));
            return;
          }

          chrome.bookmarks.move(results[0].id, { parentId: folders[0].id }, () => {
            resolve(true);
          });
        });
      });
    } else {
      console.log('Development mode: simulating bookmark move');
      resolve(true);
    }
  });
};

export const deleteFolder = async (folderTitle: string) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.search({ title: folderTitle }, (results) => {
        if (results.length > 0) {
          chrome.bookmarks.removeTree(results[0].id, () => {
            resolve(true);
          });
        } else {
          reject(new Error('Folder not found'));
        }
      });
    } else {
      console.log('Development mode: simulating folder deletion');
      resolve(true);
    }
  });
};

export const createChromeFolder = async (folderName: string): Promise<ChromeBookmark> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      // First, check if a folder with this name already exists
      chrome.bookmarks.search({ title: folderName }, (results) => {
        if (results.length > 0 && results.some(r => r.url === undefined)) {
          reject(new Error('A folder with this name already exists'));
          return;
        }

        // Create folder in the bookmarks bar (parentId: "1")
        chrome.bookmarks.create({
          title: folderName,
          parentId: "1"
        }, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome API Error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log('Folder created successfully:', result);
            window.dispatchEvent(new Event('bookmarks-updated'));
            resolve(result);
          }
        });
      });
    } else if (isDevelopment) {
      console.log('Development mode: simulating folder creation');
      setTimeout(() => {
        const mockFolder = {
          id: "mock-id-" + Date.now(),
          parentId: "1",
          title: folderName,
          dateAdded: Date.now()
        };
        console.log('Mock folder created:', mockFolder);
        window.dispatchEvent(new Event('bookmarks-updated'));
        resolve(mockFolder);
      }, 500);
    } else {
      reject(new Error('Chrome API not available'));
    }
  });
};

export const createChromeBookmark = async (folderId: string, url: string, title: string): Promise<ChromeBookmark> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.create({
        parentId: folderId,
        title: title,
        url: url
      }, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          window.dispatchEvent(new Event('bookmarks-updated'));
          resolve(result);
        }
      });
    } else {
      console.log('Development mode: simulating bookmark creation');
      const mockBookmark = {
        id: "mock-id-" + Date.now(),
        parentId: folderId,
        title,
        url,
        dateAdded: Date.now()
      };
      window.dispatchEvent(new Event('bookmarks-updated'));
      resolve(mockBookmark);
    }
  });
};