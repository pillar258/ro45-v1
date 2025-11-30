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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <LicenseAcquisitionForm dict={dict} />
      </div>
    </div>
  );
}
