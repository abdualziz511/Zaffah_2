import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/contact — جلب الرسائل (للأدمن)
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/contact — إرسال رسالة جديدة (للزوار)
export async function POST(request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة: الاسم، البريد، الموضوع، الرسالة' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }])
      .select()
      .single();

    if (error) {
      console.error('[Contact POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
