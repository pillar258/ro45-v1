"use client"
import { Button } from './ui/button'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { Locale } from '@/i18n'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EventRegisterForm({ locale, eventId }: { locale: Locale; eventId: string }) {
  const zh = locale==='zh'
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    checkRegistration()
  }, [eventId])
  
  const checkRegistration = async () => {
    setChecking(true)
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setChecking(false); return }
    const { data: existed } = await supabase.from('event_registrations').select('id').eq('event_id', eventId).eq('user_id', user.id).limit(1)
    setRegistered(existed !== null && existed.length > 0)
    setChecking(false)
  }
  
  const handleRegister = async () => {
    setError(''); setLoading(true)
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setLoading(false); setError(zh?'请先登录并完成验证':'Please log in and verify email'); return }
    
    const { data: existed } = await supabase.from('event_registrations').select('id').eq('event_id', eventId).eq('user_id', user.id).limit(1)
    if (existed && existed.length>0) { 
      setLoading(false); 
      setRegistered(true); 
      return 
    }
    
    const { error } = await supabase.from('event_registrations').insert({ event_id: eventId, user_id: user.id })
    setLoading(false)
    if (error) { 
      if (error.code === '23505') {
        setRegistered(true)
      } else {
        setError(zh?'报名失败':'Register failed')
      }
      return 
    }
    setRegistered(true)
    router.refresh()
  }
  
  const handleUnregister = async () => {
    setError(''); setLoading(true)
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) { setLoading(false); setError(zh?'请先登录':'Please log in'); return }
    
    const { error } = await supabase.from('event_registrations').delete().eq('event_id', eventId).eq('user_id', user.id)
    setLoading(false)
    if (error) { setError(zh?'取消失败':'Cancel failed'); return }
    setRegistered(false)
    router.refresh()
  }
  
  if (checking) {
    return <div className="text-sm text-gray-600">{zh?'检查中...':'Checking...'}</div>
  }
  
  return (
    <div className="grid gap-2 max-w-md">
      {registered ? (
        <>
          <div className="text-sm text-green-600">{zh?'已报名':'Registered'}</div>
          <Button type="button" variant="outline" onClick={handleUnregister} disabled={loading}>
            {loading ? (zh?'处理中...':'Processing...') : (zh?'取消报名':'Cancel Registration')}
          </Button>
        </>
      ) : (
        <Button type="button" onClick={handleRegister} disabled={loading}>
          {loading ? (zh?'报名中...':'Registering...') : (zh?'报名':'Register')}
        </Button>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}
