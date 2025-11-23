"use client"
import { useEffect, useState } from 'react'
import { createClient } from '../utils/supabase/client'
import clsx from 'clsx'

type Comment = { id: string; author_name?: string; content: string; created_at?: string }

export default function CommentsList({ locale, postId, onRefreshed }: { locale: 'zh' | 'en'; postId: string; onRefreshed?: () => void }) {
  const zh = locale==='zh'
  const [items, setItems] = useState<Comment[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const load = async (p = 1) => {
    const supabase = createClient()
    const from = (p - 1) * 10
    const to = from + 9
    let q = supabase.from('comments').select('*', { count: 'exact' }).eq('post_id', postId).order('created_at', { ascending: false })
    const { data, count } = await q.range(from, to)
    setItems((data ?? []) as any)
    setTotalPages(Math.max(1, Math.ceil((count ?? 0) / 10)))
    setPage(p)
    onRefreshed && onRefreshed()
  }
  useEffect(() => { load(1) }, [postId])
  return (
    <div className="grid gap-3">
      <h2 className="text-lg font-semibold">{zh?'评论':'Comments'}</h2>
      <ul className="grid gap-2">
        {items.map(c => (
          <li key={c.id} className="border rounded p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-brand-700">{c.author_name ?? 'member'}</span>
              {c.created_at && <span>{c.created_at.slice(0, 10)}</span>}
            </div>
            <div className="mt-1 text-sm">{c.content}</div>
          </li>
        ))}
      </ul>
      {totalPages>1 && (
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: totalPages }).map((_, i) => i + 1).map(p => (
            <button key={p} className={clsx('px-3 py-1 rounded border text-sm', p===page && 'bg-brand-600 text-white border-brand-600')} onClick={()=>load(p)}>{p}</button>
          ))}
        </div>
      )}
      <button className="text-sm text-brand-700" onClick={()=>load(page)}>{zh?'刷新评论':'Refresh'}</button>
    </div>
  )
}
