import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantPageSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar skeleton (RestaurantInfo) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 p-1">
        {/* Location section */}
        <div className="p-5 flex flex-col gap-4 rounded-2xl border">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
        {/* Opening hours section */}
        <div className="p-5 flex flex-col gap-4 rounded-2xl border">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        {/* Contact & services section */}
        <div className="p-5 flex flex-col gap-4 rounded-2xl border">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Main content skeleton (MenuDisplaySection) */}
      <div className="flex-1 w-full min-w-0">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-40 rounded-3xl" />
          <Skeleton className="w-full h-40 rounded-3xl" />
          <Skeleton className="w-full h-40 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
