import type { Locale } from '../../../../../i18n'

export default function AdminEventDetail({ params }: { params: { locale: Locale, id: string } }) {
  const zh = params.locale==='zh'
  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-semibold">{zh?'活动详情':'Event Detail'} #{params.id}</h1>
      <div className="border rounded p-4">
        <div className="text-sm text-gray-600">{zh?'基本信息':'Basic Info'}</div>
        <div className="mt-2">{zh?'标题':'Title'}: RO149 Annual Forum</div>
        <div className="mt-2">{zh?'日期':'Date'}: 2025-06-23</div>
        <div className="mt-2">{zh?'状态':'Status'}: draft</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-brand-600 text-white rounded">{zh?'发布':'Publish'}</button>
        <button className="px-3 py-2 border rounded">{zh?'下线':'Unpublish'}</button>
      </div>
    </div>
  )
}