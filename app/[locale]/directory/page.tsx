import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import BusinessListings from '@/components/BusinessListings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DirectoryPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale);

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">{dict.directory_page.title}</h1>
            <p className="text-gray-600">{dict.publish_page.subtitle}</p>
        </div>
        <Link href={`/${locale}/publish`}>
            <Button>{dict.publish_page.title}</Button>
        </Link>
      </div>
      
      <BusinessListings locale={locale} dict={dict} />
    </div>
  );
}
