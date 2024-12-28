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
import { Label } from "@/components/ui/label";

interface AddBookmarkDialogProps {
  folderTitle: string;
  onBookmarkAdd: (url: string, title: string) => void;
}

export function AddBookmarkDialog({ folderTitle, onBookmarkAdd }: AddBookmarkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookmarkAdd(url, title);
    setUrl("");
    setTitle("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmark to {folderTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="My Bookmark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Bookmark
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}