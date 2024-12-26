import { Code, Share2, Newspaper, Globe } from "lucide-react";

interface FolderHeaderProps {
  title: string;
  thumbnailUrl?: string;
  bookmarksCount: number;
  view: "grid" | "list";
}

export function FolderHeader({ title, thumbnailUrl, bookmarksCount, view }: FolderHeaderProps) {
  const getFolderIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('development')) return <Code className="w-12 h-12 text-primary/60" />;
    if (lowercaseTitle.includes('social')) return <Share2 className="w-12 h-12 text-primary/60" />;
    if (lowercaseTitle.includes('news')) return <Newspaper className="w-12 h-12 text-primary/60" />;
    return <Globe className="w-12 h-12 text-primary/60" />;
  };

  const getBackgroundGradient = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('development')) return 'from-blue-500/5 to-blue-500/10';
    if (lowercaseTitle.includes('social')) return 'from-purple-500/5 to-purple-500/10';
    if (lowercaseTitle.includes('news')) return 'from-orange-500/5 to-orange-500/10';
    return 'from-gray-500/5 to-gray-500/10';
  };

  return (
    <div className={view === "list" ? "flex flex-1" : ""}>
      <div className={`relative ${view === "list" ? "w-48" : "aspect-video"} overflow-hidden`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`flex items-center justify-center h-full bg-gradient-to-br ${getBackgroundGradient(title)} transition-all duration-300 group-hover:opacity-80`}>
            {getFolderIcon(title)}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {bookmarksCount} bookmark{bookmarksCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}