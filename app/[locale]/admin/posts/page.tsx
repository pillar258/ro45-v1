import Link from 'next/link'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import { parsePage } from '../../../../lib/pagination'
import { getPosts } from '../../../../lib/provider'
import { isAdminSession } from '../../../../lib/adminSession'
import { adminGetPosts } from '../../../../lib/adminProvider'

export default async function AdminPosts({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const zh = params.locale==='zh'
  const base = `/${params.locale}/admin/posts`
  const page = parsePage(searchParams)
  const { items, totalPages } = isAdminSession() ? await adminGetPosts(page) : await getPosts({ page })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{zh?'文章管理':'Posts'}</h1>
      <Toolbar placeholder={zh?'搜索文章':'Search posts'} />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">{zh?'标题':'Title'}</th>
            <th className="py-2">{zh?'作者':'Author'}</th>
            <th className="py-2">{zh?'状态':'Status'}</th>
            <th className="py-2">{zh?'操作':'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.id}</td>
              <td className="py-2">{p.title}</td>
              <td className="py-2">{p.author_name ?? ''}</td>
              <td className="py-2">{p.status}</td>
              <td className="py-2">
                <Link className="text-brand-700" href={`${base}/${p.id}`}>{zh?'详情':'Detail'}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination basePath={base} page={page} totalPages={totalPages} />
    </div>
  )
}