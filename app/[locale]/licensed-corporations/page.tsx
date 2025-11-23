import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import { createClient } from '@/utils/supabase/server';
import LicensedCorporationsClientPage from './client-page';
import { LicensedCorporation } from '@/types/licensed-corporation';

export default async function LicensedCorporationsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const supabase = createClient();

  const { data: corporations, error } = await supabase
    .from('licensed_corporations')
    .select('*');

  if (error) {
    console.error('Error fetching licensed corporations:', error);
    // Render an error state or return an empty array
    return <div>Error loading data.</div>;
  }

  const corporationList: LicensedCorporation[] = corporations || [];

  return <LicensedCorporationsClientPage corporations={corporationList} dictionary={dictionary} locale={locale} />;
}

