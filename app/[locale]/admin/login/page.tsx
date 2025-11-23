"use client"
import type { Locale } from '../../../../i18n'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: 'Error' }))
      setError(zh ? (data.message==='DEV admin not configured' ? '尚未配置开发管理员' : '账号或密码错误') : (data.message==='DEV admin not configured' ? 'Dev admin not configured' : 'Invalid credentials'))
      return
    }
    router.push(`/${params.locale}/admin`)
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">{zh?'管理登录':'Admin Login'}</h1>
      <div className="grid gap-3">
        <Input placeholder={zh?'用户名':'Username'} value={username} onChange={e=>setUsername(e.target.value)} />
        <Input placeholder={zh?'密码':'Password'} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button type="button" onClick={onSubmit} disabled={loading}>{loading ? (zh?'登录中...':'Signing in...') : (zh?'登录':'Login')}</Button>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
      <p className="text-sm text-gray-600 mt-3">{zh?'开发环境绕过登录：在服务端设置 DEV_ADMIN_USER/DEV_ADMIN_PASS。':'Dev bypass login: set DEV_ADMIN_USER/DEV_ADMIN_PASS on server.'}</p>
    </div>
  )
}