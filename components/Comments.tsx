import { Badge } from './ui/badge'
import { getComments } from '../lib/provider'

export default async function Comments({ locale, postId }: { locale: 'zh' | 'en'; postId?: string }) {
  const { items } = await getComments({ page: 1, postId })
  return (
    <div className="grid gap-3">
      <h2 className="text-lg font-semibold">{locale==='zh'?'评论':'Comments'}</h2>
      <ul className="grid gap-2">
        {items.map(c => (
          <li key={c.id} className="border rounded p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="brand">{c.author_name ?? 'member'}</Badge>
              {c.created_at && <span>{c.created_at?.slice(0, 10)}</span>}
            </div>
            <div className="mt-1 text-sm">{c.content}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}