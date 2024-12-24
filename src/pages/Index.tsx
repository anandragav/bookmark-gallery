import { BookmarkFolder } from "@/components/BookmarkFolder";

// Mock data - this would be replaced with actual Chrome bookmarks API data
const mockFolders = [
  {
    title: "Development",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    bookmarks: [
      { title: "GitHub", url: "https://github.com" },
      { title: "Stack Overflow", url: "https://stackoverflow.com" },
      { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
    ],
  },
  {
    title: "Productivity",
    thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bookmarks: [
      { title: "Notion", url: "https://notion.so" },
      { title: "Trello", url: "https://trello.com" },
      { title: "Google Calendar", url: "https://calendar.google.com" },
    ],
  },
  {
    title: "Learning",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    bookmarks: [
      { title: "Coursera", url: "https://coursera.org" },
      { title: "edX", url: "https://edx.org" },
      { title: "Khan Academy", url: "https://khanacademy.org" },
    ],
  },
  {
    title: "Design Resources",
    bookmarks: [
      { title: "Dribbble", url: "https://dribbble.com" },
      { title: "Behance", url: "https://behance.net" },
      { title: "Figma", url: "https://figma.com" },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Bookmarks Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Your bookmarks, beautifully organized
          </p>
        </header>

        <div className="masonry-grid">
          {mockFolders.map((folder, index) => (
            <BookmarkFolder
              key={index}
              title={folder.title}
              bookmarks={folder.bookmarks}
              thumbnailUrl={folder.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;