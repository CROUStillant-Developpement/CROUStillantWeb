import { Skeleton } from "./ui/skeleton";

export default function RestaurantCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full h-56" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton className="w-32 h-4 mt-2" />
      <div className="mt-2 flex gap-1 items-center justify-between">
        <div className="flex gap-1 items-center">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
        <Skeleton className="w-32 h-8" />
      </div>
    </div>
  );
}
