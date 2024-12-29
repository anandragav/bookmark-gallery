import { ChromeBookmark } from "@/types/bookmark.types";

export const getChromeBookmarks = async (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        resolve(bookmarkTreeNodes);
      });
    } else {
      console.log('Development mode: returning sample bookmarks');
      // Return sample data in development mode
      resolve([{
        id: "1",
        title: "Bookmarks Bar",
        children: [
          {
            id: "2",
            title: "Development",
            children: [
              {
                id: "3",
                title: "GitHub",
                url: "https://github.com"
              },
              {
                id: "4",
                title: "Stack Overflow",
                url: "https://stackoverflow.com"
              }
            ]
          },
          {
            id: "5",
            title: "Social",
            children: [
              {
                id: "6",
                title: "Twitter",
                url: "https://twitter.com"
              },
              {
                id: "7",
                title: "LinkedIn",
                url: "https://linkedin.com"
              }
            ]
          }
        ]
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
      // Create folder in the bookmarks bar (parentId: "1")
      chrome.bookmarks.create({
        title: folderName,
        parentId: "1"
      }, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    } else {
      console.log('Development mode: simulating folder creation');
      // In development mode, return a mock folder
      resolve({
        id: "mock-id-" + Date.now(),
        title: folderName,
        dateAdded: Date.now()
      });
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
          resolve(result);
        }
      });
    } else {
      console.log('Development mode: simulating bookmark creation');
      resolve({
        id: "mock-id-" + Date.now(),
        title,
        url,
        dateAdded: Date.now()
      });
    }
  });
};