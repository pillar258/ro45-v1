import { createAdminClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const submissionData = {
      acquirer_type: body.acquirer_type,
      acquirer_name: body.acquirer_name,
      contact_phone: body.contact_phone,
      email: body.email,
      wechat: body.wechat,
      license_types_sought: body.license_types_sought,
      acquisition_method: body.acquisition_method,
      other_license_type: body.other_license_type,
      budget: body.budget,
    };

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('license_acquisitions')
      .insert([submissionData]);

    if (error) {
      console.error('Error inserting data into Supabase:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission successful' }, { status: 201 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
