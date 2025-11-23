import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const id = body?.id as string
  const status = body?.status as 'pending'|'published'|'archived'|'draft'
  const sess = cookies().get('admin_session')?.value
  if (!sess) return NextResponse.json({ ok: false, message: 'not admin' }, { status: 401 })
  const supabase = createAdminClient()
  const { error } = await supabase.from('posts').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ ok: false, message: 'update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}