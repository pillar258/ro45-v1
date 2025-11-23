"use client"
import type { Locale } from '../../../../i18n'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'

export default function ProfilePage({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setEmail(u?.email || '')
      setConfirmed(Boolean(u?.email_confirmed_at))
      const meta = (u?.user_metadata ?? {}) as any
      setDisplayName(meta.display_name || '')
      setAvatarUrl(meta.avatar_url || '')
    })
  }, [])

  const save = async () => {
    setError(''); setOk(false)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim(), avatar_url: avatarUrl.trim() } })
    if (error) { setError(zh?'保存失败':'Save failed'); return }
    setOk(true)
  }

  return (
    <div className="max-w-md grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'我的资料':'My Profile'}</h1>
      <div className="text-sm text-gray-700">{zh?'邮箱':'Email'}: {email} {confirmed===false ? `· ${zh?'未验证':'Unverified'}` : ''}</div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {ok && <div className="text-sm text-green-600">{zh?'已保存':'Saved'}</div>}
      <Input placeholder={zh?'显示名称':'Display Name'} value={displayName} onChange={e=>setDisplayName(e.target.value)} />
      <Input placeholder={zh?'头像 URL':'Avatar URL'} value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={save}>{zh?'保存':'Save'}</Button>
        <Button variant="outline" onClick={()=>location.assign(`/${params.locale}/verify-pending`)}>{zh?'前往验证':'Go to verify'}</Button>
      </div>
    </div>
  )
}