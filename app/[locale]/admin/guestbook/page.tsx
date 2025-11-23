import Link from 'next/link'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import { parsePage } from '../../../../lib/pagination'
import { getGuestbook } from '../../../../lib/provider'
import { isAdminSession } from '../../../../lib/adminSession'
import { adminGetGuestbook } from '../../../../lib/adminProvider'

export default async function AdminGuestbook({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const zh = params.locale==='zh'
  const base = `/${params.locale}/admin/guestbook`
  const page = parsePage(searchParams)
  const { items, totalPages } = isAdminSession() ? await adminGetGuestbook(page) : await getGuestbook({ page })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{zh?'留言管理':'Guestbook'}</h1>
      <Toolbar placeholder={zh?'搜索留言':'Search messages'} />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">{zh?'昵称':'Nickname'}</th>
            <th className="py-2">{zh?'状态':'Status'}</th>
            <th className="py-2">{zh?'操作':'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.id}</td>
              <td className="py-2">{m.nickname ?? ''}</td>
              <td className="py-2">{m.status ?? ''}</td>
              <td className="py-2">
                <Link className="text-brand-700" href={`${base}/${m.id}`}>{zh?'详情':'Detail'}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination basePath={base} page={page} totalPages={totalPages} />
    </div>
  )
}