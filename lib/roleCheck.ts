import { createClient } from '@/utils/supabase/server'

export type UserRole = 'member' | 'admin'

/**
 * 检查用户是否为管理员
 * @param userId 用户ID
 * @returns 是否为管理员
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    return user?.role === 'admin'
  } catch (error) {
    console.error('Role check error:', error)
    return false
  }
}

/**
 * 获取用户角色
 * @param userId 用户ID
 * @returns 用户角色
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    return user?.role || 'member'
  } catch (error) {
    console.error('Get user role error:', error)
    return null
  }
}

/**
 * 检查用户是否有权限执行操作
 * @param userId 用户ID
 * @param requiredRole 需要的角色
 * @returns 是否有权限
 */
export async function hasPermission(userId: string, requiredRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole(userId)
  if (!userRole) return false
  
  // 管理员有所有权限
  if (userRole === 'admin') return true
  
  // 会员只能执行会员级别的操作
  return userRole === requiredRole
}

/**
 * 获取当前登录用户的角色（基于会话）
 * @returns 当前用户角色
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.id) return null
    
    return await getUserRole(session.user.id)
  } catch (error) {
    console.error('Get current user role error:', error)
    return null
  }
}

/**
 * 检查当前登录用户是否为管理员
 * @returns 是否为管理员
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.id) return false
    
    return await isUserAdmin(session.user.id)
  } catch (error) {
    console.error('Check current user admin error:', error)
    return false
  }
}