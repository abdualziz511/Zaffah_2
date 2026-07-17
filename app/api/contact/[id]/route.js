import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// DELETE /api/contact/[id] — حذف رسالة
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Contact DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/contact/[id] — وضع علامة "مقروء"
export async function PATCH(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Contact PATCH]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
