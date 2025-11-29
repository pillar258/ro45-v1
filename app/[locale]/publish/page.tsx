import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HubCarousel } from '@/components/HubCarousel';

// Mock Data Generator
function generateMockItems(currentItems: any[], targetCount: number, categoryLabel: string, categoryId: string) {
  if (currentItems.length >= targetCount) return currentItems;

  const needed = targetCount - currentItems.length;
  const mocks = Array.from({ length: needed }).map((_, i) => ({
    id: `mock-${categoryId}-${i}`,
    name: `${categoryLabel} Sample ${i + 1}`,
    description: `This is a sample description for ${categoryLabel}. Real content will appear here once published.`,
    created_at: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000),
    category: [categoryId === 'introduction' ? 'licensed_corp' : 'other'],
    is_mock: true
  }));

  return [...currentItems, ...mocks];
}

function SectionGrid({ title, items, dict, moreLink }: { title: string, items: any[], dict: any, moreLink: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-2xl font-bold border-l-4 border-brand-600 pl-3">{title}</h3>
        <Link href={moreLink} className="text-sm font-medium text-brand-600 hover:text-brand-800 hover:underline flex items-center">
          {dict.publish_page.hub.more || 'More'} &gt;&gt;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow flex flex-col hover:border-brand-200">
             <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className={`font-bold text-base line-clamp-1 ${item.is_mock ? 'text-muted-foreground' : ''}`}>
                   {item.name}
                </h4>
                <span className="text-xs text-muted-foreground shrink-0">
                   {new Date(item.created_at).toLocaleDateString()}
                </span>
             </div>
             <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                   {item.category && item.category[0] ? (dict.publish_page.form[item.category[0]] || item.category[0]) : 'General'}
                </Badge>
                {item.is_mock && <Badge variant="outline" className="text-[10px] h-5">Sample</Badge>}
             </div>
             <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
             </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function PublishHubPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);
  const supabase = createClient();

  // Fetch Data
  const [introRes, roRes, cptRes, typeIntroRes, typeBizRes, typeOtherRes] = await Promise.all([
    // For Carousel (Top items from different sources)
    supabase.from('business_listings').select('*').contains('type', ['introduction']).order('created_at', { ascending: false }).limit(3),
    supabase.from('ro_profiles').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('cpt_courses').select('*').limit(3),
    
    // For Sections
    supabase.from('business_listings').select('*').contains('type', ['introduction']).order('created_at', { ascending: false }).limit(10),
    supabase.from('business_listings').select('*').contains('type', ['business']).order('created_at', { ascending: false }).limit(10),
    supabase.from('business_listings').select('*').contains('type', ['other']).order('created_at', { ascending: false }).limit(10)
  ]);

  // Normalize Data for Carousel
  const carouselItems = [
    ...(introRes.data?.map((i: any) => ({
        id: `intro-${i.id}`,
        title: i.name,
        description: i.description,
        imageUrl: i.image_url,
        typeLabel: dict.publish_page.hub.type_intro,
        link: `/${locale}/directory?type=introduction`, 
        date: i.created_at
    })) || []),
    ...(roRes.data?.map((i: any) => ({
        id: `ro-${i.id}`,
        title: i.name_en + (i.name_zh ? ` ${i.name_zh}` : ''),
        description: `${i.industry_experience || ''} ${i.license_types?.join(', ') || ''}`,
        imageUrl: null, 
        typeLabel: dict.publish_page.hub.type_ro,
        link: `/${locale}/ro-information`,
        date: i.created_at
    })) || []),
    ...(cptRes.data?.map((i: any) => ({
        id: `cpt-${i.id}`,
        title: i.title,
        description: i.description,
        imageUrl: i.image_url,
        typeLabel: dict.publish_page.hub.type_cpt,
        link: `/${locale}/cpt-courses`,
        date: null
    })) || [])
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 8);

  // Prepare Section Data (Pad with Mocks)
  const introItems = generateMockItems(typeIntroRes.data || [], 10, dict.publish_page.hub.col_intro, 'introduction');
  const bizItems = generateMockItems(typeBizRes.data || [], 10, dict.publish_page.hub.col_business, 'business');
  const otherItems = generateMockItems(typeOtherRes.data || [], 10, dict.publish_page.hub.col_other, 'other');

  return (
    <div className="container py-8 space-y-12 max-w-7xl mx-auto">
       {/* Header with Carousel and Create Button */}
       <div className="space-y-6">
          <div className="flex justify-end">
             <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-md">
                <Link href={`/${locale}/publish/create`}>{dict.publish_page.hub.create_btn}</Link>
             </Button>
          </div>
          
          <HubCarousel items={carouselItems} />
       </div>

       {/* Latest Updates Sections */}
       <div className="space-y-10">
          <SectionGrid 
             title={dict.publish_page.hub.col_intro} 
             items={introItems} 
             dict={dict}
             moreLink={`/${locale}/directory?type=introduction`}
          />

          <SectionGrid 
             title={dict.publish_page.hub.col_business} 
             items={bizItems} 
             dict={dict}
             moreLink={`/${locale}/directory?type=business`}
          />

          <SectionGrid 
             title={dict.publish_page.hub.col_other} 
             items={otherItems} 
             dict={dict}
             moreLink={`/${locale}/directory?type=other`}
          />
       </div>
    </div>
  )
}
