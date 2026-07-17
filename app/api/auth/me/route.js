import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/me — التحقق من الجلسة الحالية
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'غير مسجل الدخول' },
        { status: 401 }
      );
    }

    const validToken = process.env.ADMIN_SECRET_TOKEN;
    const adminEmail = process.env.ADMIN_EMAIL;

    // إذا كان ADMIN_SECRET_TOKEN مضبوطاً، نتحقق منه
    if (validToken && token !== validToken) {
      return NextResponse.json(
        { authenticated: false, error: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: { email: adminEmail || 'admin' }
    });

  } catch (err) {
    console.error('[Auth Me Error]', err);
    return NextResponse.json(
      { authenticated: false, error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
