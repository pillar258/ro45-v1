import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
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
