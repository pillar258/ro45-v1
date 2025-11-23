'use client'

import { useState, useEffect } from 'react'
import type { Locale } from '../../../../../i18n'
import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'

interface User {
  id: string
  email?: string
  role?: 'member' | 'admin'
  display_name?: string
  created_at?: string
}

export default function AdminUserDetail({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin-user-detail?id=${params.id}`)
      const data = await res.json()
      if (data.ok) {
        setUser(data.user)
      } else {
        setMessage(zh ? '获取用户信息失败' : 'Failed to get user info')
      }
    } catch (error) {
      setMessage(zh ? '网络错误' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (newRole: 'member' | 'admin') => {
    if (!user) return
    
    setUpdating(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/admin-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: newRole })
      })
      
      const data = await res.json()
      if (data.ok) {
        setUser({ ...user, role: newRole })
        setMessage(zh ? '角色更新成功' : 'Role updated successfully')
      } else {
        setMessage(data.message || (zh ? '更新失败' : 'Update failed'))
      }
    } catch (error) {
      setMessage(zh ? '网络错误' : 'Network error')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="p-4">{zh?'加载中...':'Loading...'}</div>
  }

  if (!user) {
    return <div className="p-4 text-red-600">{zh?'用户不存在':'User not found'}</div>
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">{zh?'用户详情':'User Detail'}</h1>
      
      {message && (
        <div className={`p-3 rounded ${message.includes('成功') || message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="border rounded p-4 bg-white">
        <div className="text-sm text-gray-600 mb-3">{zh?'基本信息':'Basic Info'}</div>
        <div className="space-y-2">
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>{zh?'邮箱':'Email'}:</strong> {user.email || '-'}</div>
          <div><strong>{zh?'显示名':'Display Name'}:</strong> {user.display_name || '-'}</div>
          <div><strong>{zh?'注册时间':'Registration Time'}:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
        </div>
      </div>

      <div className="border rounded p-4 bg-white">
        <div className="text-sm text-gray-600 mb-3">{zh?'角色管理':'Role Management'}</div>
        <div className="flex items-center gap-3 mb-3">
          <span><strong>{zh?'当前角色':'Current Role'}:</strong></span>
          <span className={`px-2 py-1 rounded text-sm ${
            user.role === 'admin' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role === 'admin' ? (zh?'管理员':'Admin') : (zh?'会员':'Member')}
          </span>
        </div>
        
        <div className="flex gap-2">
          {user.role === 'member' ? (
            <Button 
              onClick={() => updateRole('admin')}
              disabled={updating}
              className="bg-red-600 hover:bg-red-700"
            >
              {updating ? (zh?'更新中...':'Updating...') : (zh?'升级为管理员':'Promote to Admin')}
            </Button>
          ) : (
            <Button 
              onClick={() => updateRole('member')}
              disabled={updating}
              variant="outline"
            >
              {updating ? (zh?'更新中...':'Updating...') : (zh?'降级为会员':'Demote to Member')}
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded p-4 bg-white">
        <div className="text-sm text-gray-600 mb-3">{zh?'快速操作':'Quick Actions'}</div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300">
            {zh?'重置密码':'Reset Password'}
          </Button>
          <Button variant="outline" className="border-orange-300 text-orange-600">
            {zh?'禁用账号':'Disable Account'}
          </Button>
        </div>
      </div>
    </div>
  )
}