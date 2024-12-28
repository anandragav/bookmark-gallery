import { Code, Share2, Newspaper, Globe, Bookmark, FileText, Link, Folder, Image, Video } from "lucide-react";

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
    if (lowercaseTitle.includes('development') || lowercaseTitle.includes('code')) return <Code className="w-8 h-8 text-primary/80" />;
    if (lowercaseTitle.includes('social') || lowercaseTitle.includes('share')) return <Share2 className="w-8 h-8 text-purple-500/80" />;
    if (lowercaseTitle.includes('news')) return <Newspaper className="w-8 h-8 text-orange-500/80" />;
    if (lowercaseTitle.includes('bookmark')) return <Bookmark className="w-8 h-8 text-blue-500/80" />;
    if (lowercaseTitle.includes('file') || lowercaseTitle.includes('doc')) return <FileText className="w-8 h-8 text-green-500/80" />;
    if (lowercaseTitle.includes('link')) return <Link className="w-8 h-8 text-cyan-500/80" />;
    if (lowercaseTitle.includes('image') || lowercaseTitle.includes('photo')) return <Image className="w-8 h-8 text-pink-500/80" />;
    if (lowercaseTitle.includes('video')) return <Video className="w-8 h-8 text-red-500/80" />;
    if (lowercaseTitle.includes('folder')) return <Folder className="w-8 h-8 text-yellow-500/80" />;
    return <Globe className="w-8 h-8 text-primary/80" />;
  };

  const getBackgroundGradient = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('development') || lowercaseTitle.includes('code')) 
      return 'bg-gradient-to-br from-blue-500/5 to-blue-500/20';
    if (lowercaseTitle.includes('social') || lowercaseTitle.includes('share'))
      return 'bg-gradient-to-br from-purple-500/5 to-purple-500/20';
    if (lowercaseTitle.includes('news'))
      return 'bg-gradient-to-br from-orange-500/5 to-orange-500/20';
    if (lowercaseTitle.includes('bookmark'))
      return 'bg-gradient-to-br from-blue-400/5 to-blue-400/20';
    if (lowercaseTitle.includes('file') || lowercaseTitle.includes('doc'))
      return 'bg-gradient-to-br from-green-500/5 to-green-500/20';
    if (lowercaseTitle.includes('link'))
      return 'bg-gradient-to-br from-cyan-500/5 to-cyan-500/20';
    if (lowercaseTitle.includes('image') || lowercaseTitle.includes('photo'))
      return 'bg-gradient-to-br from-pink-500/5 to-pink-500/20';
    if (lowercaseTitle.includes('video'))
      return 'bg-gradient-to-br from-red-500/5 to-red-500/20';
    if (lowercaseTitle.includes('folder'))
      return 'bg-gradient-to-br from-yellow-500/5 to-yellow-500/20';
    return 'bg-gradient-to-br from-gray-500/5 to-gray-500/20';
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
    <div className={`flex items-center justify-center h-full ${getBackgroundGradient(title)} transition-all duration-300 group-hover:opacity-80`}>
      {getFolderIcon(title)}
    </div>
  );
}