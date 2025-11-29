import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import Section from '@/components/Section';
import { BusinessListingForm } from '@/components/forms/BusinessListingForm';

export default async function PublishPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{dict.publish_page.title}</h1>
        <p className="text-gray-600 text-lg">{dict.publish_page.subtitle}</p>
      </div>
      
      <BusinessListingForm dict={dict} />
    </div>
  );
}
