import Link from 'next/link'
import type { Locale } from '../../../../i18n'
import Toolbar from '../../../../components/ui/toolbar'
import Pagination from '../../../../components/ui/pagination'
import { parsePage } from '../../../../lib/pagination'
import { getUsers } from '../../../../lib/provider'
import { isAdminSession } from '../../../../lib/adminSession'
import { adminGetUsers } from '../../../../lib/adminProvider'

export default async function AdminUsers({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const zh = params.locale==='zh'
  const base = `/${params.locale}/admin/users`
  const page = parsePage(searchParams)
  const search = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) || undefined
  const { items, totalPages } = isAdminSession() ? await adminGetUsers(page) : await getUsers({ page, search })
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{zh?'用户管理':'Users'}</h1>
      <Toolbar placeholder={zh?'搜索用户':'Search users'} />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">{zh?'邮箱':'Email'}</th>
            <th className="py-2">{zh?'角色':'Role'}</th>
            <th className="py-2">{zh?'操作':'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(u => (
            <tr key={u.id} className="border-b">
              <td className="py-2">{u.id}</td>
              <td className="py-2">{u.email}</td>
              <td className="py-2">{u.role}</td>
              <td className="py-2">
                <Link className="text-brand-700" href={`${base}/${u.id}`}>{zh?'详情':'Detail'}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination basePath={base} page={page} totalPages={totalPages} />
    </div>
  )
}