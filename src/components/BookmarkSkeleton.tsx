import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookmarkSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <Card className={`group overflow-hidden ${view === "list" ? "flex" : ""}`}>
      <div className={`${view === "list" ? "w-48" : "aspect-video"}`}>
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
}