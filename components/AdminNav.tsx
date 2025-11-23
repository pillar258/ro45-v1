"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Locale } from '@/i18n'

export default function AdminNav({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/'
  const base = `/${locale}/admin`
  const items = [
    { href: base, label: locale==='zh'?'主页':'Home' },
    { href: `${base}/users`, label: locale==='zh'?'用户':'Users' },
    { href: `${base}/posts`, label: locale==='zh'?'文章':'Posts' },
    { href: `${base}/comments`, label: locale==='zh'?'评论':'Comments' },
    { href: `${base}/guestbook`, label: locale==='zh'?'留言':'Guestbook' },
    { href: `${base}/events`, label: locale==='zh'?'活动':'Events' },
    { href: `${base}/settings`, label: locale==='zh'?'设置':'Settings' }
  ]
  return (
    <nav className="container flex gap-3 border-b py-2 text-sm">
      {items.map(it => {
        const active = pathname === it.href
        return (
          <Link key={it.href} href={it.href} className={active?"text-brand-700 font-medium":"text-gray-600 hover:text-brand-600"}>{it.label}</Link>
        )
      })}
    </nav>
  )
}
