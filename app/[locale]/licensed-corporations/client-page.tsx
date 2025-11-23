"use client";

import { useState, useMemo, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LicensedCorporation } from '@/types/licensed-corporation';
import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '../../../../i18n';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface LicensedCorporationsClientPageProps {
  corporations: LicensedCorporation[];
  dictionary: Dictionary;
  locale: Locale;
}

const licenseTypes = [
  { id: 'type1', label: '第1类：证券交易' },
  { id: 'type2', label: '第2类：期货合约交易' },
  { id: 'type3', label: '第3类：杠杆式外汇交易' },
  { id: 'type4', label: '第4类：就证券提供意见' },
  { id: 'type5', label: '第5类：就期货合约提供意见' },
  { id: 'type6', label: '第6类：就机构融资提供意见' },
  { id: 'type7', label: '第7类：提供自动化交易服务' },
  { id: 'type8', label: '第8类：提供证券保证金融资' },
  { id: 'type9', label: '第9类：提供资产管理' },
  { id: 'type10', label: '第10类：提供信贷评级服务' },
];

export default function LicensedCorporationsClientPage({ corporations, dictionary, locale }: LicensedCorporationsClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const t = dictionary.licensed_corporations_page || {};

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchTerm(event.target.value);
    });
  };

  const handleTypeChange = (type: string) => {
    startTransition(() => {
      setSelectedTypes(prev =>
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
    });
  };

  const filteredCorporations = useMemo(() => {
    return corporations.filter(corp => {
      const nameMatch = corp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = selectedTypes.length === 0 || selectedTypes.every(type => corp.license_type.includes(type));
      return nameMatch && typeMatch;
    });
  }, [corporations, searchTerm, selectedTypes]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">{t.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-2xl font-semibold mb-4">{t.filter_title}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">{t.search_by_name}</Label>
                <Input
                  id="search-name"
                  type="text"
                  placeholder={t.search_placeholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mt-1"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t.filter_by_type}</h3>
                <div className="space-y-2">
                  {licenseTypes.map(license => (
                    <div key={license.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={license.id}
                        checked={selectedTypes.includes(license.label)}
                        onCheckedChange={() => handleTypeChange(license.label)}
                      />
                      <Label htmlFor={license.id} className="font-normal">{license.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
          {isPending ? (
            <div className="flex justify-center items-center h-64">
              <p>{t.loading}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCorporations.length > 0 ? (
                filteredCorporations.map(corp => (
                  <Card key={corp.id}>
                    <CardHeader>
                      <CardTitle>{corp.name}</CardTitle>
                    </CardHeader>
                    <div className="p-4 pt-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.license_no_label}: {corp.license_number}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.license_type_label}: {corp.license_type.join(', ')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.effective_date_label}: {new Date(corp.effective_date).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">{t.no_results}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
