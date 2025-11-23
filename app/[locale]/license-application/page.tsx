import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '../../../i18n';
import { LicenseApplicationForm } from '@/components/forms/LicenseApplicationForm';

export default async function LicenseApplicationPage({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const dict = await getDictionary(locale);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{dict.nav.licenseApplication}</h1>
      <LicenseApplicationForm dict={dict} />
    </div>
  );
}
