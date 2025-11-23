import { createClient } from '../utils/supabase/server'
import { PAGE_SIZE } from './pagination'

type SourceType = 'editorial' | 'community'
type ContentType = 'news' | 'research' | 'education' | 'events' | 'opinion'
type Status = 'draft' | 'pending' | 'published' | 'archived'

export type Post = {
  id: string
  title: string
  excerpt?: string
  cover?: string
  content?: string
  source_type?: SourceType
  content_type?: ContentType
  status: Status
  author_id?: string
  author_name?: string
  created_at?: string
}

export type Event = {
  id: string
  title: string
  date?: string
  location?: string
  image?: string
  source_type?: SourceType
  status: Status
  created_at?: string
}

export type Comment = {
  id: string
  post_id: string
  author_name?: string
  content: string
  created_at?: string
  status?: 'visible' | 'hidden'
}

export type Guestbook = {
  id: string
  nickname?: string
  content: string
  created_at?: string
  status?: 'visible' | 'hidden'
}

export type UserRow = {
  id: string
  email?: string
  role?: 'member' | 'admin'
  display_name?: string
  created_at?: string
}

type PageResult<T> = { items: T[]; totalPages: number }

type CommonOptions = {
  page?: number
  sourceType?: SourceType
  contentType?: ContentType
  status?: Status
  search?: string
  sort?: 'created_at.desc' | 'created_at.asc'
  authorId?: string
}

export async function getPosts(opts: CommonOptions = {}): Promise<PageResult<Post>> {
  const supabase = createClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  let q = supabase.from('posts').select('*', { count: 'exact' })
  if (opts.sourceType) q = q.eq('source_type', opts.sourceType)
  if (opts.contentType) q = q.eq('content_type', opts.contentType)
  if (opts.status) q = q.eq('status', opts.status)
  if (opts.authorId) q = q.eq('author_id', opts.authorId)
  if (opts.search) q = q.ilike('title', `%${opts.search}%`)
  const orderDesc = (opts.sort ?? 'created_at.desc') === 'created_at.desc'
  q = q.order('created_at', { ascending: !orderDesc })
  const { data, count, error } = await q.range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: (data ?? []) as Post[], totalPages }
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = createClient()
  const { data } = await supabase.from('posts').select('*').eq('id', id).limit(1).single()
  return (data as Post) ?? null
}

export async function getComments(opts: { page?: number; postId?: string }): Promise<PageResult<Comment>> {
  const supabase = createClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  let q = supabase.from('comments').select('*', { count: 'exact' })
  if (opts.postId) q = q.eq('post_id', opts.postId)
  q = q.order('created_at', { ascending: false })
  const { data, count, error } = await q.range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: (data ?? []) as Comment[], totalPages }
}

export async function getEvents(opts: CommonOptions = {}): Promise<PageResult<Event>> {
  const supabase = createClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  let q = supabase.from('events').select('*', { count: 'exact' })
  if (opts.sourceType) q = q.eq('source_type', opts.sourceType)
  if (opts.status) q = q.eq('status', opts.status)
  if (opts.search) q = q.ilike('title', `%${opts.search}%`)
  const orderDesc = (opts.sort ?? 'created_at.desc') === 'created_at.desc'
  q = q.order('created_at', { ascending: !orderDesc })
  const { data, count, error } = await q.range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: (data ?? []) as Event[], totalPages }
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).limit(1).single()
  return (data as Event) ?? null
}

export async function getGuestbook(opts: { page?: number }): Promise<PageResult<Guestbook>> {
  const supabase = createClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase
    .from('guestbook')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: (data ?? []) as Guestbook[], totalPages }
}

export async function getUsers(opts: { page?: number; search?: string }): Promise<PageResult<UserRow>> {
  const supabase = createClient()
  const page = Math.max(1, opts.page ?? 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  let q = supabase.from('users').select('*', { count: 'exact' })
  if (opts.search) q = q.ilike('email', `%${opts.search}%`)
  q = q.order('created_at', { ascending: false })
  const { data, count, error } = await q.range(from, to)
  if (error) return { items: [], totalPages: 1 }
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  return { items: (data ?? []) as UserRow[], totalPages }
}