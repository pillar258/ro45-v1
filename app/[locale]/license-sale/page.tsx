import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import { LicenseSaleForm } from '@/components/forms/LicenseSaleForm';

export default async function LicenseSalePage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <LicenseSaleForm dict={dictionary} />
      </div>
    </div>
  );
}
