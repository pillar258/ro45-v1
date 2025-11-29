'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/i18n';
import { Card } from '@/components/ui/card';
import { BusinessListing } from '@/types/business-listing';
import Image from 'next/image';
import { Eye, Pin } from 'lucide-react';
import clsx from 'clsx';

// Simple Tabs implementation if UI component doesn't exist or is complex
function SimpleTabs({ activeTab, onTabChange, dict }: { activeTab: string, onTabChange: (v: string) => void, dict: any }) {
  return (
    <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
      <button
        className={clsx(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          activeTab === 'introduction'
            ? 'bg-white text-brand-700 shadow'
            : 'text-gray-600 hover:bg-white/[0.12] hover:text-brand-600'
        )}
        onClick={() => onTabChange('introduction')}
      >
        {dict.directory_page.tabs.introduction}
      </button>
      <button
        className={clsx(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          activeTab === 'business'
            ? 'bg-white text-brand-700 shadow'
            : 'text-gray-600 hover:bg-white/[0.12] hover:text-brand-600'
        )}
        onClick={() => onTabChange('business')}
      >
        {dict.directory_page.tabs.business}
      </button>
    </div>
  );
}

export default function BusinessListings({ locale, dict }: { locale: Locale; dict: any }) {
  const [activeTab, setActiveTab] = useState('introduction');
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/business-listings?type=${activeTab}`);
        const json = await res.json();
        if (json.data) {
          setListings(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeTab]);

  return (
    <div>
      <SimpleTabs activeTab={activeTab} onTabChange={setActiveTab} dict={dict} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No listings found.
            </div>
          )}
          {listings.map((listing) => (
            <Card key={listing.id} className={clsx("overflow-hidden transition-shadow hover:shadow-md", listing.is_pinned && "border-brand-200 bg-brand-50/30")}>
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {listing.image_url && (
                  <div className="w-full md:w-48 h-32 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image 
                      src={listing.image_url} 
                      alt={listing.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {listing.name}
                        {listing.is_pinned && (
                          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Pin className="w-3 h-3" /> {dict.directory_page.pinned}
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1 mb-2">
                        {listing.category.map(c => dict.publish_page.form[c] || c).join(', ')}
                      </div>
                    </div>
                    {/* Optional: View Count */}
                    <div className="flex items-center text-gray-400 text-sm gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.views}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {listing.description}
                  </p>
                  
                  <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
                    {listing.phone && <span>📞 {listing.phone}</span>}
                    {listing.address && <span>📍 {listing.address}</span>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
