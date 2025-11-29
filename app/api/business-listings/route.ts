import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.json();

    // Validation could be added here or rely on DB constraints

    const { data, error } = await supabase
      .from('business_listings')
      .insert({
        user_id: session.user.id,
        type: formData.type, // Now passing an array
        category: formData.category, // Now passing an array
        name: formData.name,
        description: formData.description,
        website: formData.website,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        image_url: formData.image_url,
        status: 'pending', // Default to pending
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating business listing:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Business listing created successfully', id: data.id }, { status: 201 });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type'); // e.g., 'introduction' or 'business'
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('business_listings')
    .select('*', { count: 'exact' })
    .eq('status', 'approved') // Only show approved listings
    .order('is_pinned', { ascending: false }) // Pinned first
    .order('created_at', { ascending: false }) // Then newest
    .range(offset, offset + limit - 1);

  if (type) {
    // Use PostgreSQL array containment operator
    query = query.contains('type', [type]);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching business listings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    data, 
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit)
    }
  });
}
