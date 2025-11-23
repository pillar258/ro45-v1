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
      <h1>{dict.nav.licenseAcquisition}</h1>
      <LicenseAcquisitionForm dict={dict} />
    </div>
  );
}
