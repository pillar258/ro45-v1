'use client';

import { useState } from 'react';
import { RoProfileForm } from '@/components/forms/RoProfileForm';
import { RoSearchForm } from '@/components/forms/RoSearchForm';
import { RoSearchResults } from '@/components/RoSearchResults';

export default function RoInformationClientPage({ dictionary }: { dictionary: any }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (data: any) => {
    setIsSearching(true);
    const queryParams = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`/api/ro-searches?${queryParams}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 divide-y divide-gray-200">
      <div className="py-8">
        <RoProfileForm dict={dictionary} />
      </div>
      <div className="py-8">
        <RoSearchForm dict={dictionary} onSearch={handleSearch} />
        {isSearching ? (
          <p className="mt-8">{dictionary.forms.ro_search_form.searching_button}</p>
        ) : (
          <RoSearchResults results={searchResults} dict={dictionary} />
        )}
      </div>
    </div>
  );
}
