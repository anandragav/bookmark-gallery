import { Code, Share2, Newspaper, Globe } from "lucide-react";

interface FolderThumbnailProps {
  title: string;
  folderThumbnail: string | null;
  thumbnailError: boolean;
  onThumbnailError: () => void;
}

export function FolderThumbnail({ 
  title, 
  folderThumbnail, 
  thumbnailError,
  onThumbnailError 
}: FolderThumbnailProps) {
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

  if (folderThumbnail && !thumbnailError) {
    return (
      <img
        src={folderThumbnail}
        alt={title}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        onError={onThumbnailError}
      />
    );
  }
  
  return (
    <div className={`flex items-center justify-center h-full bg-gradient-to-br ${getBackgroundGradient(title)} transition-all duration-300 group-hover:opacity-80`}>
      {getFolderIcon(title)}
    </div>
  );
}