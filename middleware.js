import { NextResponse } from 'next/server';

// المسارات المحمية التي تتطلب تسجيل دخول
const PROTECTED = ['/admin'];
// مسار تسجيل الدخول
const LOGIN_PAGE = '/login';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // تحقق إن كان المسار محمياً
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  // قراءة الـ token من الـ cookie
  const token = request.cookies.get('admin_token')?.value;

  // إذا لا يوجد token، أعد توجيه لصفحة تسجيل الدخول
  if (!token) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // التحقق من صحة الـ token (تحقق بسيط من القيمة)
  const validToken = process.env.ADMIN_SECRET_TOKEN;

  if (validToken && token !== validToken) {
    // token خاطئ — احذفه وأعد التوجيه
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('admin_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
