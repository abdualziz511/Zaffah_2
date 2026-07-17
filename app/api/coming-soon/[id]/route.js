import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// PUT /api/coming-soon/[id] — تحديث شريحة قادم قريباً
export async function PUT(request, { params }) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id } = await params;

    const allowed = ['title', 'description', 'image_url', 'sort_order'];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const { data, error } = await supabase
      .from('coming_soon')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[ComingSoon PUT]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/coming-soon/[id] — حذف شريحة
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { error } = await supabase
      .from('coming_soon')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[ComingSoon DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
