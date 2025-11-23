import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { getDictionary } from '../../../../lib/getDictionary';
import { Locale } from '../../../../i18n';

export default async function LicensedCorporationDetailPage({ 
  params: { locale, id } 
}: { 
  params: { locale: Locale, id: string } 
}) {
  const supabase = createClient();
  const dict = await getDictionary(locale);

  const { data: corp, error } = await supabase
    .from('licensed_corporations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !corp) {
    notFound();
  }

  const displayName = locale === 'en' ? corp.name_en : corp.name_zh || corp.name_en;

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{displayName}</h1>
      
      <div className="not-prose space-y-4">
        <p><strong>Central Entity Number:</strong> {corp.central_entity_number}</p>
        <p><strong>License Types:</strong> {corp.license_types?.join(', ')}</p>
        <p><strong>Established At:</strong> {corp.established_at}</p>
        {corp.website_url && <p><strong>Website:</strong> <a href={corp.website_url} target="_blank" rel="noopener noreferrer">{corp.website_url}</a></p>}
        {corp.address && <p><strong>Address:</strong> {corp.address}</p>}
        {corp.contact_phone && <p><strong>Phone:</strong> {corp.contact_phone}</p>}
      </div>

      <h2>Business Introduction</h2>
      <p>{corp.business_introduction}</p>

      <h2>Founders and Team</h2>
      <p>{corp.founders_and_team}</p>

    </div>
  );
}
