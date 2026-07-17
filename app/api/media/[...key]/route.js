import { NextResponse } from 'next/server';

// هذا الملف تم إيقافه (Deprecated) بعد الانتقال إلى ImageKit.
// الروابط الآن عامة ومباشرة وتعمل تلقائياً دون الحاجة لبوابة الروابط المؤقتة.
export async function GET() {
  return new NextResponse('Deprecated: This endpoint is no longer in use.', { status: 410 });
}
