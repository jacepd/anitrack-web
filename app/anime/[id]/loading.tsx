export default function AnimeLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-pulse">

      {/* Hero skeleton */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 w-60 h-80 rounded-xl bg-surface" />

        {/* Info */}
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-10 bg-surface rounded-lg w-3/4" />
          <div className="h-5 bg-surface rounded-lg w-1/3" />
          <div className="flex gap-3">
            <div className="h-16 w-20 bg-surface rounded-xl" />
            <div className="h-16 w-16 bg-surface rounded-xl" />
            <div className="h-16 w-16 bg-surface rounded-xl" />
          </div>
          <div className="flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-8 w-20 bg-surface rounded-full" />
            ))}
          </div>
          <div className="flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-7 w-16 bg-surface rounded-full" />
            ))}
          </div>
          <div className="h-12 w-36 bg-surface rounded-lg" />
        </div>
      </div>

      {/* Synopsis skeleton */}
      <div className="card space-y-2">
        <div className="h-6 bg-muted rounded w-32 mb-4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/5" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>

      {/* Characters skeleton */}
      <div>
        <div className="h-6 bg-surface rounded w-36 mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <div className="aspect-square bg-muted" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related skeleton */}
      <div>
        <div className="h-6 bg-surface rounded w-36 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl bg-surface" />
              <div className="h-3 bg-surface rounded mt-2 w-full" />
              <div className="h-3 bg-surface rounded mt-1 w-2/3" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
