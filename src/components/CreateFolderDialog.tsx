import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateFolderDialogProps {
  onFolderCreate: (folderName: string) => void;
}

export function CreateFolderDialog({ onFolderCreate }: CreateFolderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!folderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      });
      return;
    }

    onFolderCreate(folderName.trim());
    setFolderName("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription id="dialog-description">
            Enter a name for your new bookmark folder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            aria-label="Folder name"
          />
          <Button onClick={handleCreate} className="w-full">
            Create Folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}