import { dispatchBookmarkUpdate } from "./events";

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