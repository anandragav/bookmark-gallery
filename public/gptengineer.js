// Development mode - mock implementation
window.gptengineer = {
  init: () => {
    console.log('GPT Engineer initialized in development mode');
    return Promise.resolve({
      success: true,
      message: 'Development environment initialized'
    });
  },
  getBookmarks: () => {
    return Promise.resolve([
      {
        id: '1',
        title: 'Example Bookmark',
        url: 'https://example.com',
        dateAdded: new Date().getTime()
      }
    ]);
  },
  version: '1.0.0-dev'
};

console.log('GPT Engineer development mode loaded');