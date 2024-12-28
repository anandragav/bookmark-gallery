import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  return (
    <div className="w-full h-full">
      <Dialog>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription id="dialog-description">
              This is the dialog description that explains the dialog's purpose.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>Dialog content goes here</p>
          </div>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Bookmark Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bookmark cards would go here */}
        </div>
      </div>
    </div>
  );
};

export default Index;