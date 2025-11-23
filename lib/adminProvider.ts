import { createAdminClient } from '../utils/supabase/server';
import { isAdminSession } from './adminSession'
import { PAGE_SIZE } from './pagination'

function getAdminClient() {
  if (!isAdminSession()) throw new Error('not admin')
  return createAdminClient();
}

type PageResult<T> = { items: T[]; totalPages: number }

export async function adminGetUsers(page = 1): Promise<PageResult<any>> {
  const supabase = getAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: data ?? [], totalPages }
}

export async function adminGetPosts(page = 1): Promise<PageResult<any>> {
  const supabase = getAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase.from('posts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: data ?? [], totalPages }
}

export async function adminGetComments(page = 1): Promise<PageResult<any>> {
  const supabase = getAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase.from('comments').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: data ?? [], totalPages }
}

export async function adminGetGuestbook(page = 1): Promise<PageResult<any>> {
  const supabase = getAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase.from('guestbook').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: data ?? [], totalPages }
}

export async function adminGetEvents(page = 1): Promise<PageResult<any>> {
  const supabase = getAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase.from('events').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: data ?? [], totalPages }
}