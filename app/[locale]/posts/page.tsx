import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import Toolbar from '../../../components/ui/toolbar'
import Pagination from '../../../components/ui/pagination'
import { Badge } from '../../../components/ui/badge'
import { parsePage } from '../../../lib/pagination'
import { getPosts } from '../../../lib/provider'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import PostsFilterBar from '../../../components/PostsFilterBar'

export default async function PostsPage({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const dict = await getDictionary(params.locale)
  const l = params.locale
  const page = parsePage(searchParams)
  const search = typeof searchParams.search==='string' ? searchParams.search : undefined
  const contentType = typeof searchParams.contentType==='string' ? searchParams.contentType as any : undefined
  const sourceType = typeof searchParams.sourceType==='string' ? searchParams.sourceType as any : undefined
  const status = typeof searchParams.status==='string' ? searchParams.status as any : 'published'
  const { items, totalPages } = await getPosts({ page, status, search, contentType, sourceType })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{dict.pages.posts}</h1>
      <PostsFilterBar locale={l} />
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <li key={p.id} className="border rounded overflow-hidden">
            <div className="relative h-40">
              {p.cover ? (
                <Image src={p.cover} alt={p.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gray-100" />
              )}
            </div>
            <div className="p-4 grid gap-2">
              <div className="flex items-center gap-2">
                {p.source_type && (
                  <Badge variant={p.source_type==='editorial'?'brand':'default'}>{p.source_type==='editorial'?(l==='zh'?'编辑部':'Editorial'):(l==='zh'?'社区':'Community')}</Badge>
                )}
                {p.content_type && (
                  <Badge>{p.content_type}</Badge>
                )}
              </div>
              <Link href={`/${l}/posts/${p.id}`} className="font-medium text-brand-700">{p.title}</Link>
              {p.excerpt && <p className="text-sm text-gray-600">{p.excerpt}</p>}
            </div>
          </li>
        ))}
      </ul>
      <Pagination basePath={`/${l}/posts`} page={page} totalPages={totalPages} />
    </div>
  )
}