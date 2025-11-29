"use client"
import Link from 'next/link'
import { clsx } from 'clsx'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { Landmark, User, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Locale } from '../i18n'

export default function NavBar({ locale, navDict }: { locale: Locale, navDict: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const base = `/${locale}`
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const link = (href: string, label: string) => {
    const active = pathname?.startsWith(href)
    const cls = clsx(
      'text-sm font-medium hover:text-brand-600',
      active && 'text-brand-700 underline underline-offset-4'
    )
    return <Link href={href} className={cls}>{label}</Link>
  }
  
  const zh = locale==='zh'
  
  useEffect(() => {
    const supabase = createClient()
    
    // 检查当前会话
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email || null)
      setLoading(false)
    }
    
    checkSession()
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user?.email || null)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
  }
  
  const UserMenu = () => {
    if (loading) {
      return <div className="text-sm text-gray-500">{zh?'加载中...':'Loading...'}</div>
    }
    
    if (userEmail) {
      return (
        <div className="flex items-center gap-3">
          <Link href={`${base}/dashboard`} className="flex items-center gap-1 text-sm text-gray-700 hover:text-brand-600">
            <User className="w-4 h-4" />
            {userEmail}
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
            title={zh?'退出登录':'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )
    }
    
    return link(`${base}/login`, navDict.login)
  }
  
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center justify-between">
        <Link href={base} className="flex items-center gap-2 font-semibold text-brand-700">
          <Landmark className="w-5 h-5" />
          RO149
        </Link>
        <nav className="flex gap-3 items-center">
          {link(`${base}/directory`, navDict.directory)}
          {link(`${base}/publish`, navDict.publish)}
          {link(`${base}/license-acquisition`, navDict.licenseAcquisition)}
          {link(`${base}/license-sale`, navDict.licenseSale)}
          {link(`${base}/ro-information`, navDict.roInformation)}
          {link(`${base}/cpt-courses`, navDict.cptCourses)}
          <UserMenu />
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}