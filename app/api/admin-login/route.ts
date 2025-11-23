import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const username = body?.username ?? ''
  const password = body?.password ?? ''

  const DEV_USER = process.env.DEV_ADMIN_USER || ''
  const DEV_PASS = process.env.DEV_ADMIN_PASS || ''

  if (!DEV_USER || !DEV_PASS) {
    return NextResponse.json({ ok: false, message: 'DEV admin not configured' }, { status: 400 })
  }

  if (username === DEV_USER && password === DEV_PASS) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', 'ok', { httpOnly: true, sameSite: 'lax', path: '/' })
    return res
  }
  return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 })
}