import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n-config';
import RoInformationClientPage from './client-page';

export default async function RoInformationPageWrapper({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  return <RoInformationClientPage dictionary={dictionary} />;
}
