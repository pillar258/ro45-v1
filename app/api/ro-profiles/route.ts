import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.json();

  const { data, error } = await supabase
    .from('ro_profiles')
    .insert({
      user_id: session.user.id,
      name_zh: formData.name_zh,
      name_en: formData.name_en,
      central_entity_number: formData.central_entity_number,
      license_types: formData.license_types,
      industry_experience: formData.industry_experience,
      languages: formData.languages,
      is_director: formData.is_director,
      is_hong_kong_resident: formData.is_hong_kong_resident,
      availability_date: formData.availability_date,
      expected_salary: formData.expected_salary,
      contact_info: formData.contact_info,
      cv_url: formData.cv_url, // Note: File upload logic needs to be handled separately.
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating RO profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'RO profile created successfully', id: data.id }, { status: 201 });
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || 'time';
  const offset = (page - 1) * limit;

  let query = supabase
    .from('ro_profiles')
    .select('*', { count: 'exact' })
    .order('is_pinned', { ascending: false });

  if (sort === 'heat') {
    query = query.order('views', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching RO profiles:', error);
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
