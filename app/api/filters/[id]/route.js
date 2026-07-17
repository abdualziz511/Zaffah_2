import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// PUT /api/filters/[id] — تحديث فلتر
export async function PUT(request, { params }) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id } = await params;

    const { data, error } = await supabase
      .from('filters')
      .update({ label: body.label })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Filters PUT]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/filters/[id] — حذف فلتر
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { error } = await supabase
      .from('filters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Filters DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
