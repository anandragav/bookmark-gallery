export const getChromeBookmarks = async () => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        resolve(bookmarkTreeNodes);
      });
    } else {
      console.log('Development mode: returning empty bookmarks');
      resolve([]);
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
      // First find the bookmark in the source folder
      chrome.bookmarks.search({ url }, (results) => {
        if (results.length === 0) {
          reject(new Error('Bookmark not found'));
          return;
        }

        // Then find the target folder
        chrome.bookmarks.search({ title: toFolder }, (folders) => {
          if (folders.length === 0) {
            reject(new Error('Target folder not found'));
            return;
          }

          // Move the bookmark to the target folder
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