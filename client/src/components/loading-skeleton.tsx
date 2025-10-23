import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-16 w-16 rounded-lg shimmer" />
        <Skeleton className="h-6 w-20 rounded-full shimmer" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 shimmer" />
        <Skeleton className="h-4 w-full shimmer" />
        <Skeleton className="h-4 w-5/6 shimmer" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg shimmer" />
    </div>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full shimmer" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3 shimmer" />
          <Skeleton className="h-4 w-1/4 shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 shimmer" />
          <Skeleton className="h-5 w-24 shimmer" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 shimmer" />
          <Skeleton className="h-5 w-20 shimmer" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg shimmer" />
        <Skeleton className="h-9 flex-1 rounded-lg shimmer" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-800">
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-24 shimmer" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-32 shimmer" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-20 shimmer" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-8 w-16 rounded shimmer" />
      </td>
    </tr>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg shimmer" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-20 shimmer" />
          <Skeleton className="h-4 w-24 shimmer" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 shimmer" />
        <Skeleton className="h-10 w-full rounded-lg shimmer" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 shimmer" />
        <Skeleton className="h-10 w-full rounded-lg shimmer" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 shimmer" />
        <Skeleton className="h-24 w-full rounded-lg shimmer" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg shimmer" />
    </div>
  );
}

export function NavigationSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-lg shimmer" />
      <Skeleton className="h-10 w-32 shimmer" />
      <Skeleton className="h-10 w-24 shimmer" />
      <Skeleton className="h-10 w-28 shimmer" />
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
  columns?: number;
  component?: "card" | "token" | "stat";
}

export function LoadingGrid({ 
  count = 6, 
  columns = 3,
  component = "card" 
}: LoadingGridProps) {
  const SkeletonComponent = {
    card: CardSkeleton,
    token: TokenCardSkeleton,
    stat: StatSkeleton,
  }[component];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stagger-item">
          <SkeletonComponent />
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 shimmer" />
        <Skeleton className="h-6 w-96 shimmer" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-48 shimmer" />
        <LoadingGrid count={6} columns={3} />
      </div>
    </div>
  );
}