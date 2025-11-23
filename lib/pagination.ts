export const PAGE_SIZE = 10

export function parsePage(searchParams: Record<string, string | string[] | undefined>): number {
  const raw = searchParams?.page
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
}

export function paginate<T>(items: T[], page: number): { sliced: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return { sliced: items.slice(start, end), totalPages }
}