import { TrendingUp, Users, CheckCircle } from 'lucide-react'

export default function StatsStrip({ dict }: { dict: any }) {
  const items = [
    { icon: TrendingUp, title: dict.marketTrends, value: '3,290' },
    { icon: Users, title: dict.membership, value: dict.membershipValue },
    { icon: CheckCircle, title: dict.compliance, value: dict.complianceValue }
  ]
  return (
    <section className="container py-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, value }) => (
          <div key={title} className="border rounded p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-brand-600" />
            <div>
              <div className="text-sm text-gray-600">{title}</div>
              <div className="text-base font-semibold">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
