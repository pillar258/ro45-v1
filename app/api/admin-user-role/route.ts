import { NextResponse } from 'next/server'
import { isAdminSession } from '../../../lib/adminSession'
import { createAdminClient } from '../../../utils/supabase/server'

export async function POST(req: Request) {
  try {
    // 验证管理员权限
    if (!isAdminSession()) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userId, role } = body

    // 验证输入
    if (!userId || !role) {
      return NextResponse.json({ ok: false, message: 'Missing userId or role' }, { status: 400 })
    }

    // 验证角色值
    if (!['member', 'admin'].includes(role)) {
      return NextResponse.json({ ok: false, message: 'Invalid role' }, { status: 400 })
    }

    // 防止管理员降级自己
    const adminClient = createAdminClient()
    const { data: currentUser } = await adminClient
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (!currentUser) {
      return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 })
    }

    // 更新用户角色
    const { error } = await adminClient
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Role update error:', error)
      return NextResponse.json({ ok: false, message: 'Failed to update role' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Role updated successfully' })
  } catch (error) {
    console.error('Role update exception:', error)
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 })
  }
}