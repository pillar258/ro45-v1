import { createAdminClient } from '../../../utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

// The schema for the license_sale_submissions table
// We are not using Zod here for backend validation to keep it simple, 
// but in a real-world scenario, you would validate the incoming data.

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Convert has_legal_entity and has_bank_account to boolean
  const has_legal_entity = body.has_legal_entity === 'yes';
  const has_bank_account = body.has_bank_account === 'yes';

  const submissionData = {
    ...body,
    has_legal_entity,
    has_bank_account,
  };

  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin
    .from('license_sale_submissions')
    .insert([submissionData]);

  if (error) {
    console.error('Error inserting data into Supabase:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Submission successful' }, { status: 201 });
}
