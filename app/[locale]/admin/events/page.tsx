import Link from 'next/link'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import { parsePage } from '../../../../lib/pagination'
import { getEvents } from '../../../../lib/provider'
import { isAdminSession } from '../../../../lib/adminSession'
import { adminGetEvents } from '../../../../lib/adminProvider'

export default async function AdminEvents({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const zh = params.locale==='zh'
  const base = `/${params.locale}/admin/events`
  const page = parsePage(searchParams)
  const { items, totalPages } = isAdminSession() ? await adminGetEvents(page) : await getEvents({ page })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{zh?'活动管理':'Events'}</h1>
      <Toolbar placeholder={zh?'搜索活动':'Search events'} />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">{zh?'标题':'Title'}</th>
            <th className="py-2">{zh?'日期':'Date'}</th>
            <th className="py-2">{zh?'状态':'Status'}</th>
            <th className="py-2">{zh?'操作':'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id} className="border-b">
              <td className="py-2">{e.id}</td>
              <td className="py-2">{e.title}</td>
              <td className="py-2">{e.date ?? ''}</td>
              <td className="py-2">{e.status}</td>
              <td className="py-2">
                <Link className="text-brand-700" href={`${base}/${e.id}`}>{zh?'详情':'Detail'}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination basePath={base} page={page} totalPages={totalPages} />
    </div>
  )
}