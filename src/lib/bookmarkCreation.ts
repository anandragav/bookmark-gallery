import { ProcessedFolder } from "@/types/bookmarks";

export const createChromeBookmark = async (folderTitle: string, url: string, title: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.search({ title: folderTitle }, (results) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      const folder = results.find(r => r.title === folderTitle && !r.url);
      if (!folder) {
        reject(new Error("Folder not found"));
        return;
      }

      chrome.bookmarks.create({
        parentId: folder.id,
        title: title,
        url: url
      }, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  });
};

export const createDevBookmark = (
  folders: ProcessedFolder[],
  setFolders: React.Dispatch<React.SetStateAction<ProcessedFolder[]>>,
  folderTitle: string,
  url: string,
  title: string
) => {
  setFolders(currentFolders => {
    return currentFolders.map(folder => {
      if (folder.title === folderTitle) {
        return {
          ...folder,
          bookmarks: [...folder.bookmarks, { title, url }]
        };
      }
      return folder;
    });
  });
};