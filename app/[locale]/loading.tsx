import { Skeleton } from '../../components/ui/skeleton'

export default function LocaleLoading() {
  return (
    <div className="container py-6 grid gap-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  )
}