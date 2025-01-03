export interface Bookmark {
  title: string;
  url: string;
}

export interface ProcessedFolder {
  title: string;
  thumbnailUrl?: string;
  bookmarks: Bookmark[];
}

export interface ChromeBookmark {
  id: string;
  parentId?: string;
  index?: number;
  url?: string;
  title: string;
  dateAdded?: number;
  dateGroupModified?: number;
  children?: ChromeBookmark[];
}

export interface BookmarkTreeNode extends ChromeBookmark {
  children?: BookmarkTreeNode[];
}

// Adding Folder type which is equivalent to ProcessedFolder
export type Folder = ProcessedFolder;