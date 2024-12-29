import { ChromeBookmark } from "@/types/bookmark.types";
import { dispatchBookmarkUpdate } from "./events";

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
            dispatchBookmarkUpdate();
            resolve(result);
          }
        });
      });
    } else {
      console.log('Development mode: simulating folder creation');
      setTimeout(() => {
        const mockFolder = {
          id: "mock-id-" + Date.now(),
          parentId: "1",
          title: folderName,
          dateAdded: Date.now()
        };
        console.log('Mock folder created:', mockFolder);
        dispatchBookmarkUpdate();
        resolve(mockFolder);
      }, 500);
    }
  });
};

export const deleteFolder = async (folderTitle: string) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.search({ title: folderTitle }, (results) => {
        if (results.length > 0) {
          chrome.bookmarks.removeTree(results[0].id, () => {
            dispatchBookmarkUpdate();
            resolve(true);
          });
        } else {
          reject(new Error('Folder not found'));
        }
      });
    } else {
      console.log('Development mode: simulating folder deletion');
      dispatchBookmarkUpdate();
      resolve(true);
    }
  });
};