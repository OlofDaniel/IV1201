import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="w-full space-y-1">
      <div className="flex gap-2 border-b pb-2">
        <Skeleton className="h-7 w-full" />
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex items-center gap-2 pt-2" key={index}>
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      ))}
    </div>
  );
}
