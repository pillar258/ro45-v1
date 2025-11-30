import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '../../../i18n';
import { LicenseAcquisitionForm } from '@/components/forms/LicenseAcquisitionForm';

export default async function LicenseAcquisitionPage({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <LicenseAcquisitionForm dict={dict} />
    </div>
  );
}
