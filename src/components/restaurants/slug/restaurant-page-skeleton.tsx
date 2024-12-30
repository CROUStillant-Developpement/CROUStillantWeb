import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantPageSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-8">
      <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
        <legend className="-ml-1 px-1 text-sm font-medium">
          <Skeleton className="w-36 h-4" />
        </legend>
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-full h-40 rounded-xl" />
        </div>
      </fieldset>
      <div>
        <div className="flex gap-4 mb-4 mt-2">
          <Skeleton className="flex-1 h-8 rounded-lg" />
          <Skeleton className="flex-1 h-8 rounded-lg" />
        </div>
        <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
          <legend className="-ml-1 px-1 text-sm font-medium">
            <Skeleton className="w-36 h-4" />
          </legend>
          <Skeleton className="w-full h-10" />
          <div className="flex flex-wrap">
            <div className="w-1/2 p-1">
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <div className="w-1/2 p-1">
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <div className="w-1/2 p-1">
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <div className="w-1/2 p-1">
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
