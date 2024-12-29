import { ChromeBookmark } from "@/types/bookmark.types";

export const getChromeBookmarks = async (): Promise<ChromeBookmark[]> => {
  if (typeof chrome !== 'undefined' && chrome.bookmarks) {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        resolve(bookmarkTreeNodes);
      });
    });
  }
  
  // Return mock data in development
  return Promise.resolve([
    {
      id: "0",
      title: "Root",
      children: [
        {
          id: "1",
          title: "Bookmarks Bar",
          children: [
            {
              id: "2",
              title: "Development",
              children: [
                {
                  id: "3",
                  title: "React Documentation",
                  url: "https://react.dev"
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
};

export const removeBookmark = async (url: string, folderTitle: string) => {
  if (typeof chrome !== 'undefined' && chrome.bookmarks) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search({ url }, (results) => {
        if (results.length > 0) {
          const bookmark = results.find(b => {
            if (!b.parentId) return false;
            return chrome.bookmarks.get(b.parentId, (parent) => {
              return parent[0].title === folderTitle;
            });
          });
          
          if (bookmark) {
            chrome.bookmarks.remove(bookmark.id, resolve);
          } else {
            reject(new Error('Bookmark not found in specified folder'));
          }
        } else {
          reject(new Error('Bookmark not found'));
        }
      });
    });
  }
  console.log('Development mode: removing bookmark');
  return Promise.resolve();
};

export const moveBookmark = async (url: string, fromFolder: string, toFolder: string) => {
  if (typeof chrome !== 'undefined' && chrome.bookmarks) {
    try {
      const [bookmark] = await new Promise<ChromeBookmark[]>((resolve) => {
        chrome.bookmarks.search({ url }, resolve);
      });

      if (!bookmark) {
        throw new Error('Bookmark not found');
      }

      const [targetFolder] = await new Promise<ChromeBookmark[]>((resolve) => {
        chrome.bookmarks.search({ title: toFolder }, resolve);
      });

      if (!targetFolder) {
        throw new Error('Target folder not found');
      }

      await new Promise<void>((resolve) => {
        chrome.bookmarks.move(bookmark.id, { parentId: targetFolder.id }, () => resolve());
      });

    } catch (error) {
      console.error('Error moving bookmark:', error);
      throw error;
    }
  } else {
    console.log('Development mode: moving bookmark');
  }
};