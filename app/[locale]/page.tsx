import StatsStrip from '@/components/StatsStrip'
import PartnersStrip from '@/components/PartnersStrip'
import CTASection from '@/components/CTASection'
import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/i18n'
import DashboardHero from '@/components/DashboardHero'

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  return (
    <div className="grid gap-10">
      <DashboardHero dict={dict.dashboard_hero} />
      <StatsStrip dict={dict.stats_strip} />
      <PartnersStrip dict={dict.partners_strip} />
      <CTASection dict={dict.cta_section} />
    </div>
  )
}