export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-64 sm:w-80" />
      <Skeleton className="mt-2 h-4 max-w-xl" />
      <div className="mt-8 grid gap-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}
