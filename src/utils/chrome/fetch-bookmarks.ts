import { ChromeBookmark } from "@/types/bookmark.types";

const getSampleBookmarks = (): ChromeBookmark[] => [
  {
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
  }
];

export const getChromeBookmarks = async (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log('Chrome API returned bookmarks:', bookmarkTreeNodes);
        resolve(bookmarkTreeNodes);
      });
    } else {
      console.log('Development mode: returning sample bookmarks');
      resolve(getSampleBookmarks());
    }
  });
};