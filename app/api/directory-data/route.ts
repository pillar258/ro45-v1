import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'time'; // 'time' or 'heat'

  const getSortOrder = (query: any) => {
    // Always sort by pinned first
    query = query.order('is_pinned', { ascending: false });
    
    if (sort === 'heat') {
      // Then by views (heat)
      query = query.order('views', { ascending: false });
    } else {
      // Default by time
      query = query.order('created_at', { ascending: false });
    }
    return query;
  };

  try {
    // 1. Business Listings (Approved only)
    let businessQuery = supabase
      .from('business_listings')
      .select('*')
      .eq('status', 'approved');
    businessQuery = getSortOrder(businessQuery).limit(10);

    // 2. License Acquisitions
    let acquisitionQuery = supabase.from('license_acquisitions').select('*');
    acquisitionQuery = getSortOrder(acquisitionQuery).limit(10);

    // 3. License Sales (Using submissions table for now, assuming it holds the data)
    let saleQuery = supabase.from('license_sale_submissions').select('*');
    saleQuery = getSortOrder(saleQuery).limit(10);

    // 4. RO Profiles
    let roQuery = supabase.from('ro_profiles').select('*');
    roQuery = getSortOrder(roQuery).limit(10);

    const [businessRes, acquisitionRes, saleRes, roRes] = await Promise.all([
      businessQuery,
      acquisitionQuery,
      saleQuery,
      roQuery
    ]);

    if (businessRes.error) console.error('Business error:', businessRes.error);
    if (acquisitionRes.error) console.error('Acquisition error:', acquisitionRes.error);
    if (saleRes.error) console.error('Sale error:', saleRes.error);
    if (roRes.error) console.error('RO error:', roRes.error);

    return NextResponse.json({
      business: businessRes.data || [],
      license_acquisition: acquisitionRes.data || [],
      license_transfer: saleRes.data || [],
      ro_info: roRes.data || [],
    });
  } catch (error) {
    console.error('Directory data fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
