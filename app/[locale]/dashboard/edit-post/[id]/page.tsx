"use client"
import type { Locale } from '../../../../../i18n'
import { Input } from '../../../../../components/ui/input'
import { Select } from '../../../../../components/ui/select'
import { Button } from '../../../../../components/ui/button'
import RichTextEditor from '../../../../../components/RichTextEditor'
import { useEffect, useState } from 'react'
import { createClient } from '../../../../../utils/supabase/client'
import { sanitizeHtml } from '../../../../../lib/sanitizeHtml'

export default function EditPostPage({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [cover, setCover] = useState('')
  const [content, setContent] = useState('')
  const [contentType, setContentType] = useState('news')
  const [status, setStatus] = useState<'draft'|'published'>('draft')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data: u } = await supabase.auth.getUser()
      const userId = u.user?.id
      const { data: p } = await supabase.from('posts').select('*').eq('id', params.id).single()
      if (!p) { setError(zh?'未找到内容':'Post not found'); return }
      if (p.author_id && userId && p.author_id !== userId) { setAllowed(false); return }
      setTitle(p.title || '')
      setExcerpt(p.excerpt || '')
      setCover(p.cover || '')
      setContent(p.content || '')
      setContentType(p.content_type || 'news')
      setStatus((p.status==='published'?'published':'draft'))
    }
    run()
  }, [params.id, zh])

  const save = async (next?: 'draft'|'published') => {
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('posts').update({
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      cover: cover.trim() || null,
      content: sanitizeHtml(content.trim()) || null,
      content_type: contentType,
      status: next ?? status,
    }).eq('id', params.id)
    setLoading(false)
    if (error) { setError(zh?'保存失败':'Save failed'); return }
    if ((next ?? status)==='published') location.assign(`/${params.locale}/posts/${params.id}`)
  }

  if (!allowed) {
    return <div className="text-sm text-red-600">{zh?'仅作者可编辑该内容':'Only author can edit this post'}</div>
  }

  return (
    <div className="max-w-2xl grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'编辑内容':'Edit Content'} #{params.id}</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Input placeholder={zh?'标题':'Title'} value={title} onChange={e=>setTitle(e.target.value)} />
      <Input placeholder={zh?'摘要':'Excerpt'} value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
      <Input placeholder={zh?'封面图片 URL':'Cover image URL'} value={cover} onChange={e=>setCover(e.target.value)} />
      <RichTextEditor value={content} onChange={setContent} />
      <Select value={contentType} onChange={e=>setContentType(e.target.value)}>
        <option value="news">{zh?'新闻':'News'}</option>
        <option value="research">{zh?'研究':'Research'}</option>
        <option value="education">{zh?'教育':'Education'}</option>
        <option value="events">{zh?'活动':'Events'}</option>
        <option value="opinion">{zh?'观点':'Opinion'}</option>
      </Select>
      <Select value={status} onChange={e=>setStatus(e.target.value as 'draft'|'published')}>
        <option value="draft">{zh?'草稿':'Draft'}</option>
        <option value="published">{zh?'发布':'Published'}</option>
      </Select>
      <div className="flex gap-2">
        <Button disabled={loading} onClick={()=>save()}>{loading ? (zh?'保存中…':'Saving…') : (zh?'保存':'Save')}</Button>
        <Button variant="outline" disabled={loading} onClick={()=>save('published')}>{zh?'保存并发布':'Save & Publish'}</Button>
      </div>
    </div>
  )
}
