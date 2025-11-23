"use client"
import { useState } from 'react'
import type { Locale } from '../../../../i18n'
import { Input } from '../../../../components/ui/input'
import RichTextEditor from '../../../../components/RichTextEditor'
import { Select } from '../../../../components/ui/select'
import { Button } from '../../../../components/ui/button'
import { createClient } from '../../../../utils/supabase/client'
import { sanitizeHtml } from '../../../../lib/sanitizeHtml'

export default function NewPostPage({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [cover, setCover] = useState('')
  const [content, setContent] = useState('')
  const [contentType, setContentType] = useState('news')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const submitWithStatus = async (status: 'draft' | 'published') => {
    setError('')
    if (!title.trim()) { setError(zh?'请输入标题':'Please enter title'); return }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setLoading(false); setError(zh?'请先登录并完成验证':'Please log in and verify email'); return }
    const authorId = user.id
    const authorName = user.email || 'member'
    let inserted: any = null
    let insertErr: any = null
    const payload: any = {
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      cover: cover.trim() || null,
      content_type: contentType,
      source_type: 'community',
      status,
      author_id: authorId,
      author_name: authorName,
      content: sanitizeHtml(content.trim()) || null,
    }
    const r1 = await supabase.from('posts').insert(payload).select().single()
    inserted = r1.data; insertErr = r1.error
    if (insertErr) {
      const payload2 = { ...payload }
      delete payload2.content
      const r2 = await supabase.from('posts').insert(payload2).select().single()
      inserted = r2.data; insertErr = r2.error
    }
    setLoading(false)
    if (insertErr) { setError(zh?'提交失败，请稍后重试':'Submit failed, please try again later'); return }
    const id = inserted?.id as string
    if (id && status==='published') location.assign(`/${params.locale}/posts/${id}`)
    if (id && status==='draft') location.assign(`/${params.locale}/dashboard/my-posts`)
  }

  return (
    <div className="max-w-2xl grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'新建内容':'Create New Content'}</h1>
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
      {showPreview && (
        <div className="border rounded p-4 grid gap-2">
          <div className="text-lg font-medium">{title || (zh?'预览标题':'Preview title')}</div>
          {excerpt && <div className="text-sm text-gray-700">{excerpt}</div>}
          {cover ? <img src={cover} alt="cover" className="w-full h-40 object-cover rounded" /> : <div className="w-full h-40 bg-gray-100 rounded" />}
          {content && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
      )}
      <div className="flex gap-2">
        <Button disabled={loading} onClick={()=>submitWithStatus('published')}>{loading ? (zh?'提交中…':'Submitting…') : (zh?'发布':'Publish')}</Button>
        <Button variant="outline" disabled={loading} onClick={()=>submitWithStatus('draft')}>{zh?'保存草稿':'Save Draft'}</Button>
        <Button variant="ghost" onClick={()=>setShowPreview(v=>!v)}>{showPreview ? (zh?'关闭预览':'Close Preview') : (zh?'预览':'Preview')}</Button>
        <Button variant="outline" onClick={()=>location.assign(`/${params.locale}/dashboard/my-posts`)}>{zh?'我的发布':'My Posts'}</Button>
      </div>
    </div>
  )
}
