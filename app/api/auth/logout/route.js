import { NextResponse } from 'next/server';

// POST /api/auth/logout
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });

  // حذف الـ cookie
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
