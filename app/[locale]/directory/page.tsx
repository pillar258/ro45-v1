import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import DirectoryContent from '@/components/DirectoryContent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HubCarousel } from '@/components/HubCarousel';
import { createClient } from '@/utils/supabase/server';

export default async function DirectoryPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);
  const supabase = createClient();

  // Fetch Data for Carousel (Top items from different sources)
  const [introRes, roRes, cptRes] = await Promise.all([
    supabase.from('business_listings').select('*').contains('type', ['introduction']).order('created_at', { ascending: false }).limit(3),
    supabase.from('ro_profiles').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('cpt_courses').select('*').limit(3)
  ]);

  // Normalize Data for Carousel
  const carouselItems = [
    ...(introRes.data?.map((i: any) => ({
        id: `intro-${i.id}`,
        title: i.name,
        description: i.description,
        imageUrl: i.image_url,
        typeLabel: dict.publish_page?.hub?.type_intro || 'Intro',
        link: `/${locale}/directory?type=introduction`, 
        date: i.created_at
    })) || []),
    ...(roRes.data?.map((i: any) => ({
        id: `ro-${i.id}`,
        title: i.name_en + (i.name_zh ? ` ${i.name_zh}` : ''),
        description: `${i.industry_experience || ''} ${i.license_types?.join(', ') || ''}`,
        imageUrl: null, 
        typeLabel: dict.publish_page?.hub?.type_ro || 'RO',
        link: `/${locale}/ro-information`,
        date: i.created_at
    })) || []),
    ...(cptRes.data?.map((i: any) => ({
        id: `cpt-${i.id}`,
        title: i.title,
        description: i.description,
        imageUrl: i.image_url,
        typeLabel: dict.publish_page?.hub?.type_cpt || 'CPT',
        link: `/${locale}/cpt-courses`,
        date: null
    })) || [])
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 8);

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      {/* Carousel Section */}
      <div className="mb-10">
        <HubCarousel items={carouselItems} />
      </div>
      
      {/* 4 Vertical Sections */}
      <DirectoryContent locale={locale} dict={dict} />
    </div>
  );
}
