'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Pin, Clock, Flame, ArrowRight, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

type SortType = 'time' | 'heat';

interface SectionProps {
  title: string;
  endpoint: string;
  renderItem: (item: any) => React.ReactNode;
  dict: any;
  viewMoreLink?: string;
  className?: string;
}

function DirectorySection({ title, endpoint, renderItem, dict, viewMoreLink, className }: SectionProps) {
  const [sort, setSort] = useState<SortType>('time');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch more items for grid layout
        const res = await fetch(`${endpoint}?sort=${sort}&limit=5`);
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, sort]);

  return (
    <div className={clsx("bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full", className)}>
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-5 bg-brand-600 rounded-full"></div>
            {title}
          </h2>
          <div className="flex items-center gap-3">
             <div className="flex bg-white rounded-lg p-0.5 shadow-sm border border-gray-100">
                <button 
                    onClick={() => setSort('time')}
                    className={clsx("p-1.5 rounded-md transition-all", sort === 'time' ? "bg-brand-50 text-brand-600" : "text-gray-400 hover:text-gray-600")}
                    title={dict.common?.sort_time || 'Time'}
                >
                    <Clock className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setSort('heat')}
                    className={clsx("p-1.5 rounded-md transition-all", sort === 'heat' ? "bg-brand-50 text-brand-600" : "text-gray-400 hover:text-gray-600")}
                    title={dict.common?.sort_heat || 'Hot'}
                >
                    <Flame className="w-4 h-4" />
                </button>
             </div>
             
             {viewMoreLink && (
                 <Link href={viewMoreLink} className="text-gray-400 hover:text-brand-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                 </Link>
             )}
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow">
        {loading ? (
          <div className="space-y-3">
             {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <div className="grid gap-3">
             {data.length === 0 && (
                <div className="text-gray-400 text-center py-10 flex flex-col items-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-2">
                        <Eye className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm">{dict.common?.no_data || 'No items found.'}</p>
                </div>
             )}
             {data.map(item => (
               <div key={item.id} className={clsx("group relative p-3 rounded-lg border transition-all hover:shadow-md hover:border-brand-200 bg-white", item.is_pinned ? "border-brand-100 bg-brand-50/10" : "border-gray-100")}>
                  {renderItem(item)}
               </div>
             ))}
          </div>
        )}
      </div>
      
      {viewMoreLink && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/30 rounded-b-xl text-center">
             <Link href={viewMoreLink} className="text-xs font-medium text-gray-500 hover:text-brand-600 flex items-center justify-center gap-1 transition-colors py-1">
                {dict.common?.view_more || 'View More'} <ArrowRight className="w-3 h-3" />
             </Link>
        </div>
      )}
    </div>
  );
}

export default function DirectoryContent({ locale, dict }: { locale: string; dict: any }) {
  // Helper to render Business Listing
  const renderBusiness = (item: any) => (
    <div className="flex gap-3 items-start">
        {item.image_url && (
            <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
        )}
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {item.name}
                </h3>
                {item.is_pinned && (
                     <Pin className="w-3 h-3 text-brand-500 flex-shrink-0 fill-brand-500" />
                )}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex gap-2 flex-wrap items-center">
                {item.type && item.type.length > 0 && (
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600">
                        {dict.publish_page?.form?.[item.type[0]] || item.type[0]}
                    </span>
                )}
                <span className="flex items-center gap-0.5 ml-auto text-[10px] text-gray-400">
                    <Eye className="w-3 h-3" /> {item.views || 0}
                </span>
            </div>
            <p className="text-gray-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">{item.description}</p>
        </div>
    </div>
  );

  // Helper to render License Acquisition
  const renderAcquisition = (item: any) => (
      <div>
          <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {item.acquirer_name}
                  <span className="text-xs font-normal text-gray-400 ml-1">({item.acquirer_type === 'company' ? dict.forms?.company : dict.forms?.individual})</span>
              </h3>
              {item.is_pinned && <Pin className="w-3 h-3 text-brand-500 flex-shrink-0 fill-brand-500" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
              {item.license_types_sought?.map((l: string) => (
                   <span key={l} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-medium">{l}</span>
              ))}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="text-gray-600 font-medium">{item.budget || 'Negotiable'}</span>
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                   <Eye className="w-3 h-3" /> {item.views || 0}
              </span>
          </div>
      </div>
  );

  // Helper to render License Transfer
  const renderTransfer = (item: any) => (
      <div>
           <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {item.company_name || 'Confidential Firm'}
              </h3>
              {item.is_pinned && <Pin className="w-3 h-3 text-brand-500 flex-shrink-0 fill-brand-500" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
              {item.license_types?.map((l: string) => (
                   <span key={l} className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-medium">{l}</span>
              ))}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
               <span className="text-gray-900 font-bold">{item.asking_price}</span>
               <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                   <Eye className="w-3 h-3" /> {item.views || 0}
               </span>
          </div>
      </div>
  );

  // Helper to render RO Info
  const renderRO = (item: any) => (
       <div>
           <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 group-hover:text-brand-600 transition-colors">
                  {locale === 'zh' ? (item.name_zh || item.name_en) : item.name_en}
              </h3>
              {item.is_pinned && <Pin className="w-3 h-3 text-brand-500 flex-shrink-0 fill-brand-500" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
              {item.license_types?.map((l: string) => (
                  <span key={l} className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium">{l}</span>
              ))}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
               <span>{item.industry_experience} {dict.ro_profile_form?.industry_experience?.replace('(Years)', '') || 'Yrs'} Exp.</span>
               <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                   <Eye className="w-3 h-3" /> {item.views || 0}
               </span>
          </div>
      </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DirectorySection 
            title={dict.publish_page?.title || "Business Posting"} 
            endpoint="/api/business-listings" 
            renderItem={renderBusiness} 
            dict={dict}
            viewMoreLink={`/${locale}/publish`}
        />
        <DirectorySection 
            title={dict.nav?.licenseAcquisition || (locale === 'zh' ? "牌照获取" : "License Acquisition")} 
            endpoint="/api/license-acquisitions" 
            renderItem={renderAcquisition} 
            dict={dict}
            viewMoreLink={`/${locale}/license-acquisition`}
        />
        <DirectorySection 
            title={dict.nav?.licenseSale || (locale === 'zh' ? "牌照转让" : "License Transfer")} 
            endpoint="/api/license-sales" 
            renderItem={renderTransfer} 
            dict={dict}
            viewMoreLink={`/${locale}/license-sale`}
        />
        <DirectorySection 
            title={dict.nav?.roInformation || (locale === 'zh' ? "RO资讯" : "RO Information")} 
            endpoint="/api/ro-profiles" 
            renderItem={renderRO} 
            dict={dict}
            viewMoreLink={`/${locale}/ro-information`}
        />
    </div>
  );
}
