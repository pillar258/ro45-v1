import type { Locale } from '../../../../i18n'

export default function AdminSettings({ params }: { params: { locale: Locale } }) {
  const zh = params.locale==='zh'
  return (
    <div className="max-w-2xl grid gap-4">
      <h1 className="text-xl font-semibold">{zh?'站点设置':'Site Settings'}</h1>
      <div className="border rounded p-4 grid gap-3">
        <div className="text-sm text-gray-600">{zh?'导航与页脚':'Navigation & Footer'}</div>
        <input className="border rounded px-3 py-2" placeholder={zh?'导航链接（逗号分隔）':'Nav links (comma separated)'} />
        <input className="border rounded px-3 py-2" placeholder={zh?'页脚链接（逗号分隔）':'Footer links (comma separated)'} />
      </div>
      <div className="border rounded p-4 grid gap-3">
        <div className="text-sm text-gray-600">{zh?'首页 Banner':'Homepage Banner'}</div>
        <input className="border rounded px-3 py-2" placeholder={zh?'标题':'Title'} />
        <textarea className="border rounded px-3 py-2" placeholder={zh?'副标题':'Subtitle'} />
      </div>
      <div className="border rounded p-4 grid gap-3">
        <div className="text-sm text-gray-600">SEO</div>
        <input className="border rounded px-3 py-2" placeholder="Title" />
        <textarea className="border rounded px-3 py-2" placeholder="Description" />
      </div>
      <div className="border rounded p-4 grid gap-2">
        <div className="text-sm text-gray-600">{zh?'产品化表达指南':'Productization Guidance'}</div>
        <ul className="text-sm text-gray-700 grid gap-1">
          <li>{zh?'首页：明确价值主张、关键指标与合作伙伴露出。':'Homepage: clarify value proposition, KPIs and partner exposure.'}</li>
          <li>{zh?'会员：权益/级别/流程/FAQ 与转化 CTA。':'Membership: benefits/tiers/process/FAQ with conversion CTA.'}</li>
          <li>{zh?'列表：工具栏、分页、卡片交互统一。':'Lists: unified toolbar, pagination and card interactions.'}</li>
          <li>{zh?'详情：面包屑、信息区、分享与评论。':'Detail: breadcrumbs, info area, sharing and comments.'}</li>
          <li>{zh?'后台：审核流、站点配置与审计记录。':'Admin: moderation flows, site config and audit records.'}</li>
        </ul>
      </div>
      <button className="px-4 py-2 bg-brand-600 text-white rounded">{zh?'保存':'Save'}</button>
    </div>
  )
}