import Link from 'next/link'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import { parsePage } from '../../../../lib/pagination'
import { getComments } from '../../../../lib/provider'
import { isAdminSession } from '../../../../lib/adminSession'
import { adminGetComments } from '../../../../lib/adminProvider'

export default async function AdminComments({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const zh = params.locale==='zh'
  const base = `/${params.locale}/admin/comments`
  const page = parsePage(searchParams)
  const { items, totalPages } = isAdminSession() ? await adminGetComments(page) : await getComments({ page })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{zh?'评论管理':'Comments'}</h1>
      <Toolbar placeholder={zh?'搜索评论':'Search comments'} />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">{zh?'文章':'Post'}</th>
            <th className="py-2">{zh?'作者':'Author'}</th>
            <th className="py-2">{zh?'状态':'Status'}</th>
            <th className="py-2">{zh?'操作':'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{c.id}</td>
              <td className="py-2">{c.post_id}</td>
              <td className="py-2">{c.author_name ?? ''}</td>
              <td className="py-2">{c.status ?? ''}</td>
              <td className="py-2">
                <Link className="text-brand-700" href={`${base}/${c.id}`}>{zh?'详情':'Detail'}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination basePath={base} page={page} totalPages={totalPages} />
    </div>
  )
}