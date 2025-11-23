"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function PostsFilterBar({ locale }: { locale: 'zh' | 'en' }) {
  const zh = locale==='zh'
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const q = sp.get('search') || ''
  const contentType = sp.get('contentType') || ''
  const sourceType = sp.get('sourceType') || ''
  const status = sp.get('status') || 'published'
  const update = (kv: Record<string,string>) => {
    const s = new URLSearchParams(sp.toString())
    Object.entries(kv).forEach(([k,v]) => { if (v) s.set(k, v); else s.delete(k) })
    router.push(`${pathname}?${s.toString()}`)
  }
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <input className="h-9 px-2 border rounded" placeholder={zh?'搜索文章':'Search posts'} defaultValue={q} onBlur={e=>update({ search: e.target.value })} />
      <select className="h-9 px-2 border rounded" value={contentType} onChange={e=>update({ contentType: e.target.value })}>
        <option value="">{zh?'全部类型':'All types'}</option>
        <option value="news">{zh?'新闻':'News'}</option>
        <option value="research">{zh?'研究':'Research'}</option>
        <option value="education">{zh?'教育':'Education'}</option>
        <option value="events">{zh?'活动':'Events'}</option>
        <option value="opinion">{zh?'观点':'Opinion'}</option>
      </select>
      <select className="h-9 px-2 border rounded" value={sourceType} onChange={e=>update({ sourceType: e.target.value })}>
        <option value="">{zh?'全部来源':'All sources'}</option>
        <option value="editorial">{zh?'编辑部':'Editorial'}</option>
        <option value="community">{zh?'社区':'Community'}</option>
      </select>
      <select className="h-9 px-2 border rounded" value={status} onChange={e=>update({ status: e.target.value })}>
        <option value="published">{zh?'发布':'Published'}</option>
        <option value="pending">{zh?'待审':'Pending'}</option>
        <option value="draft">{zh?'草稿':'Draft'}</option>
        <option value="archived">{zh?'归档':'Archived'}</option>
      </select>
    </div>
  )
}