"use client"
import type { Locale } from '../../../../../i18n'
import { useEffect, useState } from 'react'

export default function AdminPostDetail({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const r = await fetch(`/api/admin-post-get`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: params.id }) })
      if (!r.ok) return
      const j = await r.json()
      const p = j.data
      setTitle(p?.title || '')
      setAuthor(p?.author_name || '')
      setStatus(p?.status || 'pending')
    }
    load()
  }, [params.id])

  const update = async (next: 'published'|'archived'|'draft'|'pending') => {
    setError('')
    const res = await fetch('/api/admin-post-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: params.id, status: next }) })
    if (!res.ok) { setError(zh?'更新失败':'Update failed'); return }
    setStatus(next)
  }

  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'文章详情':'Post Detail'} #{params.id}</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="border rounded p-4">
        <div className="text-sm text-gray-600">{zh?'基本信息':'Basic Info'}</div>
        <div className="mt-2">{zh?'标题':'Title'}: {title || '...'}</div>
        <div className="mt-2">{zh?'作者':'Author'}: {author || '...'}</div>
        <div className="mt-2">{zh?'状态':'Status'}: {status}</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-brand-600 text-white rounded" onClick={()=>update('published')}>{zh?'发布':'Publish'}</button>
        <button className="px-3 py-2 border rounded" onClick={()=>update('pending')}>{zh?'待审':'Pending'}</button>
        <button className="px-3 py-2 border rounded" onClick={()=>update('draft')}>{zh?'草稿':'Draft'}</button>
        <button className="px-3 py-2 border rounded" onClick={()=>update('archived')}>{zh?'归档':'Archive'}</button>
      </div>
    </div>
  )
}