// Development mode - mock implementation
window.gptengineer = {
  init: async function() {
    console.log('GPT Engineer initialized in development mode');
    return {
      success: true,
      message: 'Development environment initialized'
    };
  },
  getBookmarks: async function() {
    console.log('Fetching mock bookmarks');
    return [
      {
        id: '1',
        title: 'Example Bookmark',
        url: 'https://example.com',
        dateAdded: new Date().getTime()
      }
    ];
  },
  version: '1.0.0-dev'
};

console.log('GPT Engineer development mode loaded');