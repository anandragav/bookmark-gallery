export const dispatchBookmarkUpdate = () => {
  window.dispatchEvent(new Event('bookmarks-updated'));
};