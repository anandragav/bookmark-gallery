import { ChromeBookmark, ProcessedFolder } from "@/types/bookmarks";

export const fetchChromeBookmarks = (): Promise<ChromeBookmark[]> => {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(bookmarkTreeNodes);
    });
  });
};

export const fetchDevBookmarks = async (): Promise<{ folders: ProcessedFolder[], quickAccess: { title: string, url: string }[] }> => {
  const sampleFolders: ProcessedFolder[] = [
    {
      title: "Development Resources",
      bookmarks: [
        { title: "GitHub", url: "https://github.com" },
        { title: "Stack Overflow", url: "https://stackoverflow.com" },
        { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
      ],
    },
    {
      title: "Social Media",
      bookmarks: [
        { title: "Twitter", url: "https://twitter.com" },
        { title: "LinkedIn", url: "https://linkedin.com" },
        { title: "Facebook", url: "https://facebook.com" },
      ],
    },
  ];

  const quickAccess = [
    { title: "GitHub", url: "https://github.com" },
    { title: "Twitter", url: "https://twitter.com" },
  ];

  return { folders: sampleFolders, quickAccess };
};