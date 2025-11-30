import { createAdminClient, createClient } from '@/utils/supabase/server';
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

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || 'time';
  const offset = (page - 1) * limit;

  let query = supabase
    .from('license_acquisitions')
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
    console.error('Error fetching license acquisitions:', error);
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
