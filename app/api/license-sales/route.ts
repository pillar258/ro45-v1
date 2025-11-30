import { createAdminClient } from '../../../utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

// The schema for the license_sale_submissions table
// We are not using Zod here for backend validation to keep it simple, 
// but in a real-world scenario, you would validate the incoming data.

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    license_types,
    established_date,
    shareholder_count,
    has_holding_structure,
    is_holding_company_sold,
    ro_count,
    employee_count,
    total_compensation,
    asking_price,
    contact_phone,
    email,
    wechat
  } = body;

  const submissionData = {
    license_types,
    established_date,
    shareholder_count,
    has_holding_structure: has_holding_structure === 'yes',
    is_holding_company_sold: is_holding_company_sold === 'yes',
    ro_count,
    employee_count,
    total_compensation,
    asking_price,
    contact_phone,
    email,
    wechat
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
