"use client"
import { useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'

export default function CommentForm({ locale, postId, onSubmitted }: { locale: Locale; postId: string; onSubmitted?: () => void }) {
  const zh = locale!=='en'
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const router = useRouter()
  const submit = async () => {
    setError(''); setOk(false)
    if (!content.trim()) { setError(zh?'请输入评论内容':'Please enter comment'); return }
    setLoading(true)
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setLoading(false); setError(zh?'请先登录并完成验证':'Please log in and verify email'); return }
    const name = authorName.trim() || user.user_metadata?.display_name || user.email || 'member'
    const { error } = await supabase.from('comments').insert({ post_id: postId, author_name: name, content: content.trim() })
    setLoading(false)
    if (error) { setError(zh?'提交失败':'Submit failed'); return }
    setOk(true); setContent('')
    onSubmitted && onSubmitted()
    router.refresh()
  }
  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">{zh?'发布评论':'Add Comment'}</h3>
      <Input placeholder={zh?'昵称（可选）':'Nickname (optional)'} value={authorName} onChange={e=>setAuthorName(e.target.value)} />
      <Textarea rows={3} placeholder={zh?'评论内容':'Comment'} value={content} onChange={e=>setContent(e.target.value)} />
      {error && <div className="text-xs text-red-600">{error}</div>}
      {ok && <div className="text-xs text-green-600">{zh?'已提交，审核后可见':'Submitted, visible if approved'}</div>}
      <Button onClick={submit} disabled={loading}>{loading ? (zh?'提交中…':'Submitting…') : (zh?'提交':'Submit')}</Button>
    </div>
  )
}
