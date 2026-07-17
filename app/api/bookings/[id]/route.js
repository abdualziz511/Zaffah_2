import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// PUT /api/bookings/[id] — تحديث حجز
export async function PUT(request, { params }) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id } = await params;

    // نسمح فقط بتحديث حقول محددة
    const allowed = ['status', 'notes', 'booking_date', 'booking_time', 'service_type'];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Bookings PUT]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] — حذف حجز
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Bookings DELETE]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
