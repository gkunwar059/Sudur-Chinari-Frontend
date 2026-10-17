export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Editorial Skeleton Masthead ── */}
      <div className="border-b border-border bg-background py-6 sm:py-8">
        <div className="container-editorial">
          <div className="h-4 w-32 skeleton-shimmer mb-4" />
          <div className="h-10 sm:h-12 w-3/4 max-w-xl skeleton-shimmer mb-3" />
          <div className="h-4 w-1/2 max-w-md skeleton-shimmer" />
        </div>
      </div>

      {/* ── Main Editorial Grid Skeleton ── */}
      <div className="container-editorial py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Lead Story Skeleton */}
            <div className="border border-border bg-background p-4 sm:p-6">
              <div className="aspect-[16/9] w-full skeleton-shimmer mb-5" />
              <div className="h-3 w-20 skeleton-shimmer mb-3" />
              <div className="h-7 sm:h-8 w-5/6 skeleton-shimmer mb-3" />
              <div className="h-4 w-full skeleton-shimmer mb-2" />
              <div className="h-4 w-2/3 skeleton-shimmer mb-4" />
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <div className="h-3 w-28 skeleton-shimmer" />
                <div className="h-3 w-20 skeleton-shimmer" />
              </div>
            </div>

            {/* Sub-grid Skeleton (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-border bg-background p-4">
                  <div className="aspect-[16/10] w-full skeleton-shimmer mb-3" />
                  <div className="h-3 w-16 skeleton-shimmer mb-2" />
                  <div className="h-5 w-5/6 skeleton-shimmer mb-2" />
                  <div className="h-3 w-full skeleton-shimmer mb-1" />
                  <div className="h-3 w-3/4 skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Sidebar Skeleton (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-border bg-background p-5">
              <div className="h-5 w-36 skeleton-shimmer mb-4 pb-3 border-b border-border" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 items-start py-2">
                    <div className="w-6 h-6 skeleton-shimmer shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-16 skeleton-shimmer" />
                      <div className="h-4 w-full skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-background p-5">
              <div className="h-5 w-32 skeleton-shimmer mb-4 pb-3 border-b border-border" />
              <div className="h-48 w-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
