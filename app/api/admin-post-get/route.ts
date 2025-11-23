import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const id = body?.id as string
  const sess = cookies().get('admin_session')?.value
  if (!sess) return NextResponse.json({ ok: false, message: 'not admin' }, { status: 401 })
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ ok: false, message: 'not found' }, { status: 404 })
  return NextResponse.json({ ok: true, data })
}