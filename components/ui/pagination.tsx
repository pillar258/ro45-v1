import Link from 'next/link'

export default function Pagination({ basePath, page = 1, totalPages = 1 }: { basePath: string; page?: number; totalPages?: number }) {
  if (totalPages <= 1) return null
  const items = Array.from({ length: totalPages }).map((_, i) => i + 1)
  return (
    <div className="flex items-center gap-2 mt-4">
      {items.map(p => (
        <Link key={p} href={`${basePath}?page=${p}`} className={p===page?"px-3 py-1 rounded bg-brand-600 text-white":"px-3 py-1 rounded border hover:bg-gray-50"}>{p}</Link>
      ))}
    </div>
  )
}