import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const formData = await request.json();

  // This is a public form, so we don't require a session to submit.
  // However, you might want to add rate limiting or CAPTCHA in a production environment.

  const { data, error } = await supabase
    .from('license_applications')
    .insert({
      applicant_type: formData.applicant_type,
      applicant_name: formData.applicant_name,
      location: formData.location,
      industry_and_domain: formData.industry_and_domain,
      other_industry: formData.other_industry,
      license_types_applied: formData.license_types_applied,
      has_ro_candidate: formData.has_ro_candidate,
      contact_phone: formData.contact_phone,
      email: formData.email,
      wechat: formData.wechat,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating license application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'License application submitted successfully', id: data.id }, { status: 201 });
}
