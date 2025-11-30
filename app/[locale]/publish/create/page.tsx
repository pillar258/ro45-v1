import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import { BusinessListingForm } from '@/components/forms/BusinessListingForm';

export default async function CreateListingPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <BusinessListingForm dict={dict} />
      </div>
    </div>
  );
}
