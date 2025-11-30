import { NextResponse } from 'next/server'
import { isAdminSession } from '../../../lib/adminSession'
import { createAdminClient } from '../../../utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // 验证管理员权限
    if (!isAdminSession()) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ ok: false, message: 'Missing user ID' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    
    // 获取用户详细信息
    const { data: user, error } = await adminClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Get user error:', error)
      return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error('Get user exception:', error)
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 })
  }
}