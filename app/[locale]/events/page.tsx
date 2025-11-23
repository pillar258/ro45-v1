import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import FeatureCard from '../../../components/FeatureCard'
import Pagination from '../../../components/ui/pagination'
import { Badge } from '../../../components/ui/badge'
import { parsePage } from '../../../lib/pagination'
import { getEvents } from '../../../lib/provider'

export default async function EventsPage({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const dict = await getDictionary(params.locale)
  const page = parsePage(searchParams)
  const { items, totalPages } = await getEvents({ page, status: 'published' })
  const l = params.locale
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{dict.pages.events}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(e => (
          <div key={e.id} className="border rounded overflow-hidden">
            <FeatureCard
              title={e.title}
              desc={l==='zh' ? `${e.date ?? ''} · 地点 ${e.location ?? ''}` : `Date ${e.date ?? ''} · ${e.location ?? ''}`}
              imageSrc={e.image ?? 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop'}
            />
            <div className="p-3">
              {e.source_type && (
                <Badge variant={e.source_type==='editorial'?'brand':'default'}>{e.source_type==='editorial'?(l==='zh'?'官方':'Official'):(l==='zh'?'社区':'Community')}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination basePath={`/${params.locale}/events`} page={page} totalPages={totalPages} />
    </div>
  )
}