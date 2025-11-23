import type { Locale } from '../../../i18n'
import { getDictionary } from '@/lib/getDictionary';
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import Pagination from '../../../components/ui/pagination'
import { parsePage } from '../../../lib/pagination'
import { getGuestbook } from '../../../lib/provider'

export default async function GuestbookPage({ params, searchParams }: { params: { locale: Locale }; searchParams: Record<string, string | string[] | undefined> }) {
  const dict = await getDictionary(params.locale)
  const zh = params.locale==='zh'
  const page = parsePage(searchParams)
  const { items, totalPages } = await getGuestbook({ page })
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">{dict.pages.guestbook}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form className="grid gap-3">
          <Input placeholder={zh?'昵称（选填）':'Nickname (optional)'} />
          <Textarea rows={4} placeholder={zh?'留言内容':'Your message'} />
          <div className="text-xs text-gray-600">{zh?'提示：匿名提交将进行频率限制与长度校验。':'Note: Anonymous submissions are rate-limited with length checks.'}</div>
          <Button type="button">{zh?'发送留言':'Send message'}</Button>
        </form>
        <div className="grid gap-3">
          <div className="text-sm text-gray-600">{zh?'最近留言':'Recent Messages'}</div>
          <ul className="grid gap-2">
            {items.map(m => (
              <li key={m.id} className="border rounded p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="brand">{m.nickname ?? 'Guest'}</Badge>
                  {m.created_at && <span>{m.created_at.slice(0,10)}</span>}
                </div>
                <div className="mt-1 text-sm">{m.content}</div>
              </li>
            ))}
          </ul>
          <Pagination basePath={`/${params.locale}/guestbook`} page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}