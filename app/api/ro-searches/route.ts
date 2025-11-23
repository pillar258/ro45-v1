import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // While the form might be public to view, submitting a search request should likely be for authenticated users.
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const formData = await request.json();

  const { data, error } = await supabase
    .from('ro_searches')
    .insert({
      company_name_zh: formData.company_name_zh,
      company_name_en: formData.company_name_en,
      central_entity_number: formData.central_entity_number,
      license_types_needed: formData.license_types_needed,
      office_location: formData.office_location,
      salary_range: formData.salary_range,
      contact_person_name: formData.contact_person_name,
      contact_person_title: formData.contact_person_title,
      contact_info: formData.contact_info,
      other_requirements: formData.other_requirements,
      business_card_url: formData.business_card_url, // Note: File upload logic needs to be handled separately.
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating RO search:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'RO search created successfully', id: data.id }, { status: 201 });
}
