import { Skeleton } from '../../../components/ui/skeleton'

export default function PostsLoading() {
  return (
    <div className="container py-6">
      <Skeleton className="h-8 w-40 mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded overflow-hidden">
            <Skeleton className="h-40" />
            <div className="p-4 grid gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}