"use client"
import { useEffect, useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { getSupabaseClient, isSupabaseConfigured } from '../../../../lib/supabaseClient'

export default function DashboardContent({ locale }: { locale: 'zh' | 'en' }) {
  const [userEmail, setUserEmail] = useState('')
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [configured, setConfigured] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) { setConfigured(false); return }
    const supabase = getSupabaseClient()
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUserEmail(u?.email || '')
      setConfirmed(Boolean(u?.email_confirmed_at))
    })
  }, [])

  if (!configured) {
    return <div className="text-sm text-red-600">{locale==='zh'?'尚未配置 Supabase 环境变量':'Supabase env is not configured'}</div>
  }

  if (confirmed === false) {
    return (
      <div className="grid gap-2">
        <div className="text-sm text-gray-700">{locale==='zh'?'邮箱未验证，完成验证后可发布与评论。':'Email not verified. Verify to enable posting and commenting.'}</div>
        <div className="text-sm">{userEmail}</div>
        <Button onClick={() => location.assign(`/${locale}/verify-pending`)}>{locale==='zh'?'前往验证':'Go to verify'}</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="text-sm text-gray-700">{locale==='zh'?'欢迎：':'Welcome:'} {userEmail}</div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'我的资料':'My Profile'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'更新显示名称与头像等信息。':'Update display name and avatar.'}</div>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'我的发布':'My Posts'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'管理草稿、待审与已发布内容。':'Manage drafts, pending and published content.'}</div>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'活动参与':'Event Participation'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'报名大会、圆桌与工作坊等活动。':'Register for conferences, roundtables and workshops.'}</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'步骤一：完善资料':'Step 1: Complete profile'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'提升专业形象，便于交流。':'Improve professional presence for networking.'}</div>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'步骤二：创建内容':'Step 2: Create content'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'发布观点与研究，展示专业能力。':'Publish insights and research to showcase expertise.'}</div>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium">{locale==='zh'?'步骤三：参与活动':'Step 3: Join events'}</div>
          <div className="text-sm text-gray-600 mt-1">{locale==='zh'?'扩大行业影响力与联系。':'Expand industry impact and connections.'}</div>
        </div>
      </div>
      <Button onClick={() => location.assign(`/${locale}/dashboard/new-post`)}>{locale==='zh'?'新建内容':'Create new content'}</Button>
    </div>
  )
}