import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import DashboardContent from './ui/DashboardContent'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'

export default async function DashboardPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{dict.pages.dashboard}</h1>
      <DashboardContent locale={params.locale} />
      <div className="mt-6 flex gap-2">
        <Link href={`/${params.locale}/dashboard/new-post`}><Button>{params.locale==='zh'?'新建内容':'Create'}</Button></Link>
        <Link href={`/${params.locale}/dashboard/profile`}><Button variant="outline">{params.locale==='zh'?'编辑资料':'Edit Profile'}</Button></Link>
        <Link href={`/${params.locale}/dashboard/my-posts`}><Button variant="ghost">{params.locale==='zh'?'我的发布':'My Posts'}</Button></Link>
        <Link href={`/${params.locale}/dashboard/my-events`}><Button variant="ghost">{params.locale==='zh'?'我的活动':'My Events'}</Button></Link>
      </div>
    </div>
  )
}