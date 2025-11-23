import type { Locale } from '../../../../../i18n'

export default function AdminCommentDetail({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'评论详情':'Comment Detail'} #{params.id}</h1>
      <div className="border rounded p-4">
        <div className="text-sm text-gray-600">{zh?'内容':'Content'}</div>
        <div className="mt-2">很棒的文章！</div>
        <div className="mt-2">{zh?'状态':'Status'}: pending</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-brand-600 text-white rounded">{zh?'显示':'Show'}</button>
        <button className="px-3 py-2 border rounded">{zh?'隐藏':'Hide'}</button>
      </div>
    </div>
  )
}