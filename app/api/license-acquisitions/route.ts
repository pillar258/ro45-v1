import { createAdminClient } from '../../../utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 在此处可以添加 Zod 或其他方式的后端验证

    const submissionData = {
      ...body,
    };

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('license_acquisition_submissions')
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
