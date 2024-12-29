import { ChromeBookmark } from "@/types/bookmark.types";
import { dispatchBookmarkUpdate } from "./events";

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
          dispatchBookmarkUpdate();
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
      dispatchBookmarkUpdate();
      resolve(mockBookmark);
    }
  });
};

export const removeBookmark = async (url: string) => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.search({ url }, (results) => {
        if (results.length > 0) {
          chrome.bookmarks.remove(results[0].id, () => {
            dispatchBookmarkUpdate();
            resolve(true);
          });
        } else {
          reject(new Error('Bookmark not found'));
        }
      });
    } else {
      console.log('Development mode: simulating bookmark removal');
      dispatchBookmarkUpdate();
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
            dispatchBookmarkUpdate();
            resolve(true);
          });
        });
      });
    } else {
      console.log('Development mode: simulating bookmark move');
      dispatchBookmarkUpdate();
      resolve(true);
    }
  });
};