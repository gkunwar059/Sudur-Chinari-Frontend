import { cn } from "@/lib/utils";

interface PageSkeletonProps {
  variant?: "grid" | "article" | "detail";
  className?: string;
}

function Bar({ className }: { className?: string }) {
  return <div className={cn("bg-muted animate-pulse", className)} />;
}

export default function PageSkeleton({
  variant = "grid",
  className,
}: PageSkeletonProps) {
  if (variant === "article") {
    return (
      <main className={cn("flex-1 mobile-safe-bottom", className)}>
        <div className="container-editorial py-6 md:py-10">
          <div className="max-w-3xl">
            <Bar className="h-3 w-40 mb-6" />
            <Bar className="h-8 w-full mb-3" />
            <Bar className="h-8 w-2/3 mb-6" />
            <Bar className="h-3 w-56 mb-8" />
            <Bar className="aspect-video w-full mb-8" />
            <div className="space-y-3">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-5/6" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-3/4" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (variant === "detail") {
    return (
      <main className={cn("flex-1 mobile-safe-bottom", className)}>
        <div className="container-editorial py-8">
          <Bar className="h-3 w-56 mb-6" />
          <Bar className="aspect-[16/7] w-full mb-8" />
          <Bar className="h-7 w-2/3 mb-4" />
          <Bar className="h-4 w-full mb-2" />
          <Bar className="h-4 w-5/6 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="border border-border bg-surface p-5">
                <Bar className="h-5 w-1/2 mb-4" />
                <Bar className="h-4 w-3/4 mb-2" />
                <Bar className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={cn("flex-1 mobile-safe-bottom", className)}>
      <div className="container-editorial pt-12 pb-6 border-b border-border/60 mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <Bar className="h-3 w-24 hidden sm:block" />
          <Bar className="h-8 w-56" />
        </div>
        <Bar className="h-3 w-20 hidden sm:block" />
      </div>
      <div className="container-editorial pb-12 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border border-border bg-surface">
              <Bar className="aspect-video w-full" />
              <div className="p-4 space-y-3">
                <Bar className="h-4 w-full" />
                <Bar className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
