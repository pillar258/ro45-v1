"use client"
import { useEffect, useMemo, useState } from 'react'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import Image from 'next/image'
import Link from 'next/link'
import { PAGE_SIZE, parsePage } from '../../../../lib/pagination'
import { createClient } from '../../../../utils/supabase/client'
import type { Post } from '../../../../lib/provider'

export default function MyPostsPage({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const l = params.locale
  const page = parsePage(searchParams)
  const [items, setItems] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all'|'draft'|'published'>('all')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const userId = data.user?.id
      const from = Math.max(0, (page - 1) * PAGE_SIZE)
      const to = from + PAGE_SIZE - 1
      let query = supabase.from('posts').select('*', { count: 'exact' })
      if (userId) query = query.eq('author_id', userId)
      if (statusFilter !== 'all') query = query.eq('status', statusFilter)
      if (q) query = query.ilike('title', `%${q}%`)
      query = query.order('created_at', { ascending: false })
      const { data: rows, count } = await query.range(from, to)
      setItems((rows ?? []) as Post[])
      setTotalPages(Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)))
    }
    run()
  }, [page, q, statusFilter])

  const updateStatus = async (id: string, next: 'draft' | 'published') => {
    setUpdatingId(id)
    const supabase = createClient()
    const { error } = await supabase.from('posts').update({ status: next }).eq('id', id)
    setUpdatingId(null)
    if (!error) {
      setItems(prev => prev.map(p => p.id===id ? { ...p, status: next } : p))
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{l==='zh'?'我的发布':'My Posts'}</h1>
      <div className="flex items-center gap-2 mb-4">
        <input className="h-9 px-2 border rounded" placeholder={l==='zh'?'搜索我的内容':'Search my posts'} value={q} onChange={e=>setQ(e.target.value)} />
        <select className="h-9 px-2 border rounded" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="all">{l==='zh'?'全部':'All'}</option>
          <option value="draft">{l==='zh'?'草稿':'Draft'}</option>
          <option value="published">{l==='zh'?'发布':'Published'}</option>
        </select>
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <li key={p.id} className="border rounded overflow-hidden">
            <div className="relative h-40">
              {p.cover ? <Image src={p.cover} alt={p.title} fill className="object-cover" /> : <div className="absolute inset-0 bg-gray-100" />}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/${l}/posts/${p.id}`} className="font-medium text-brand-700">{p.title}</Link>
                  <Link href={`/${l}/dashboard/edit-post/${p.id}`} className="text-xs text-brand-700">{l==='zh'?'编辑':'Edit'}</Link>
                </div>
                <select
                  className="text-xs border rounded px-1 py-0.5"
                  value={p.status}
                  onChange={e => updateStatus(p.id, e.target.value as 'draft' | 'published')}
                  disabled={updatingId===p.id}
                >
                  <option value="draft">{l==='zh'?'草稿':'Draft'}</option>
                  <option value="published">{l==='zh'?'发布':'Published'}</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination basePath={`/${l}/dashboard/my-posts`} page={page} totalPages={totalPages} />
    </div>
  )
}
