import { cookies } from 'next/headers'

export function isAdminSession(): boolean {
  const v = cookies().get('admin_session')?.value
  return Boolean(v)
}