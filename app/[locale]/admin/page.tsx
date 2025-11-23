import type { Locale } from '../../../i18n'
import { Card, CardHeader, CardTitle } from '../../../components/ui/card'

export default function AdminHome({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  const cards = [
    { title: zh?'今日新增会员':'New Members Today', value: '12' },
    { title: zh?'待审文章':'Pending Posts', value: '8' },
    { title: zh?'待审评论':'Pending Comments', value: '23' },
    { title: zh?'待审留言':'Pending Guestbook', value: '5' }
  ]
  const recent = [
    { id: 'a1', text: zh?'发布文章审核通过':'Post published approved' },
    { id: 'a2', text: zh?'隐藏违规评论':'Hidden offensive comment' },
    { id: 'a3', text: zh?'更新首页 Banner':'Updated homepage banner' }
  ]
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">{zh?'后台主页':'Admin Home'}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.title}>
            <CardHeader>{c.title}</CardHeader>
            <CardTitle>{c.value}</CardTitle>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{zh?'最近操作':'Recent Actions'}</h2>
        <ul className="grid gap-2">
          {recent.map(r => (
            <Card key={r.id} className="p-3 text-sm">{r.text}</Card>
          ))}
        </ul>
      </div>
    </div>
  )
}