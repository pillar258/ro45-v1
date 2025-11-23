"use client"
import type { Locale } from '../../../i18n'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Button } from '../../../components/ui/button'
import { useState } from 'react'
import { createClient } from '../../../utils/supabase/client'

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')
  const submit = async () => {
    setError('')
    if (!name.trim() || !message.trim()) { setError(zh?'请填写姓名与留言':'Please fill in name and message'); return }
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setError(zh?'未登录用户请使用邮箱联系：':'Please contact via email:'); return }
    const nickname = name.trim()
    const content = `${message.trim()}${email ? `\nEmail: ${email.trim()}` : ''}`
    const { error: err } = await supabase.from('guestbook').insert({ nickname, content })
    if (err) { setError(zh?'提交失败，请稍后重试':'Submit failed, please try again later'); return }
    setOk(true)
    setName(''); setEmail(''); setMessage('')
  }
  return (
    <div className="max-w-xl grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'联系我们':'Contact Us'}</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {ok && <div className="text-sm text-green-600">{zh?'已提交，我们会尽快回复':'Submitted. We will get back soon.'}</div>}
      <Input placeholder={zh?'姓名':'Name'} value={name} onChange={e=>setName(e.target.value)} />
      <Input placeholder={zh?'邮箱（可选）':'Email (optional)'} value={email} onChange={e=>setEmail(e.target.value)} />
      <Textarea rows={6} placeholder={zh?'留言内容':'Message'} value={message} onChange={e=>setMessage(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={submit}>{zh?'提交':'Submit'}</Button>
        <a className="text-sm text-brand-700" href={`mailto:contact@ro149.org`}>{zh?'或发送邮件至 contact@ro149.org':'Or email contact@ro149.org'}</a>
      </div>
    </div>
  )
}