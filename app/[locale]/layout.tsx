import '../globals.css'
import Footer from '../../components/Footer'
import NavBar from '../../components/NavBar'
import type { Locale } from '../../i18n'
import { getDictionary } from '@/lib/getDictionary';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const { locale } = params
  const dict = await getDictionary(locale)
  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <NavBar locale={locale} navDict={dict.nav} />
        <main className="container py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}