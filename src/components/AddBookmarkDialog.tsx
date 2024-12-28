import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddBookmarkDialogProps {
  folderId: string;
  onBookmarkAdd: (bookmark: { title: string; url: string }) => void;
}

export function AddBookmarkDialog({ folderId, onBookmarkAdd }: AddBookmarkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url); // Validate URL format
      onBookmarkAdd({ title: title.trim(), url: url.trim() });
      setTitle("");
      setUrl("");
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Bookmark added successfully",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter bookmark title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Enter URL... (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} className="w-full">
            Add Bookmark
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}