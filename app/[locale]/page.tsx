import StatsStrip from '@/components/StatsStrip'
import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/i18n'
import DashboardHero from '@/components/DashboardHero'
import { createAdminClient } from '@/utils/supabase/server'

const defaultImages = [
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
]

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale)
  
  // Fetch dynamic data for Hero
  const supabase = createAdminClient()
  const slides: any[] = []

  try {
    // 1. Fetch Company/License Sales
    const { data: sales } = await supabase
      .from('license_sales')
      .select('company_name_en, license_types')
      .order('created_at', { ascending: false })
      .limit(2)

    if (sales && sales.length > 0) {
      sales.forEach((sale, i) => {
        slides.push({
          title: sale.company_name_en || 'License Opportunity',
          description: sale.license_types ? `License Types: ${sale.license_types.join(', ')}` : 'Contact for details',
          image: defaultImages[i % defaultImages.length],
          icon_name: 'Building'
        })
      })
    }

    // 2. Fetch RO Profiles
    const { data: ros } = await supabase
      .from('ro_profiles')
      .select('name_en, license_types, industry_experience')
      .order('created_at', { ascending: false })
      .limit(2)

    if (ros && ros.length > 0) {
      ros.forEach((ro, i) => {
        slides.push({
          title: `${ro.name_en} (RO)`,
          description: `${ro.industry_experience || 'N/A'} years exp. | Licenses: ${ro.license_types?.join(', ') || 'N/A'}`,
          image: defaultImages[(i + 2) % defaultImages.length],
          icon_name: 'UserTie'
        })
      })
    }
  } catch (error) {
    console.error('Error fetching hero data:', error)
  }

  // Fallback if no data found
  if (slides.length === 0) {
    dict.dashboard_hero.slides.forEach((slide: any, i: number) => {
      slides.push({
        ...slide,
        image: defaultImages[i % defaultImages.length]
      })
    })
  }

  return (
    <div className="grid gap-10">
      <DashboardHero slides={slides} />
      <StatsStrip dict={dict.stats_strip} />
    </div>
  )
}