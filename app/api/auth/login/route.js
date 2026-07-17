import { NextResponse } from 'next/server';

// POST /api/auth/login
// Body: { email: string, password: string }
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من بيانات الأدمن (مخزّنة في environment variables)
    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('[Auth] ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local');
      return NextResponse.json(
        { error: 'خطأ في إعداد الخادم' },
        { status: 500 }
      );
    }

    const emailMatch    = email.trim().toLowerCase() === adminEmail.toLowerCase();
    const passwordMatch = password === adminPassword;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء token بسيط (يمكن تعزيزه بـ JWT لاحقاً)
    const token = process.env.ADMIN_SECRET_TOKEN || 
                  Buffer.from(`${adminEmail}:${Date.now()}`).toString('base64');

    // إعداد الرد مع httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      admin: { email: adminEmail }
    });

    // حفظ الـ token في cookie آمنة
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('[Auth Login Error]', err);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
