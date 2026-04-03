import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantCardSkeleton() {
  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="relative h-52 w-full">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
      </div>
      <div className="p-5">
        <Skeleton className="h-6 w-3/4" />
        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            <Skeleton className="h-8 w-8 rounded-full ring-2 ring-background" />
            <Skeleton className="h-8 w-8 rounded-full ring-2 ring-background" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
