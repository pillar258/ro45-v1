"use client"
import React from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { locales } from '../i18n'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: 'zh' | 'en' | 'zh-HK' }) {
  const pathname = usePathname() || '/'
  const toLocalePath = (locale: 'zh' | 'en' | 'zh-HK') => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length === 0) return `/${locale}`
    parts[0] = locale
    return '/' + parts.join('/')
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {
        (locales.filter(l => l !== currentLocale)).map((locale, index) => (
          <React.Fragment key={locale}>
            <Link href={toLocalePath(locale)} className="hover:text-brand-600">
              {locale === 'en' ? 'EN' : locale === 'zh' ? '简体' : '繁體'}
            </Link>
            {index < locales.length - 2 && <span className="text-gray-400">/</span>}
          </React.Fragment>
        ))
      }
    </div>
  )
}