import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_FOLDER_MAP } from '@/lib/imagekit';
import { NextResponse } from 'next/server';

// ── خريطة MIME Types لضمان استقرار المعاينة ───────────────────────────────
const MIME_FALLBACKS = {
  mp3:  'audio/mpeg',
  wav:  'audio/wav',
  ogg:  'audio/ogg',
  m4a:  'audio/mp4',
  aac:  'audio/aac',
  flac: 'audio/flac',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  svg:  'image/svg+xml',
};

function resolveMimeType(file) {
  if (file.type && file.type !== 'application/octet-stream') return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return MIME_FALLBACKS[ext] || 'application/octet-stream';
}

// POST /api/upload
// FormData: { file: File, bucket: 'cover-images' | 'audio-tracks', folder?: string }
export async function POST(request) {
  try {
    const formData = await request.formData();

    const file   = formData.get('file');
    const bucket = formData.get('bucket') || 'cover-images'; // للتوافق مع المسميات القديمة
    const folder = formData.get('folder') || '';

    // ── التحقق من وجود الملف ─────────────────────────────────────────
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 });
    }

    // ── تحديد MIME Type الصحيح ───────────────────────────────────────
    const mimeType = resolveMimeType(file);

    // ── تحديد المجلد في ImageKit Media Library ───────────────────────
    const imagekitFolder = folder || IMAGEKIT_FOLDER_MAP[bucket] || '/misc';

    // ── إنشاء اسم فريد للملف ─────────────────────────────────────────
    const ext       = file.name.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const random    = Math.random().toString(36).slice(2, 8);
    const safeName  = `${timestamp}-${random}.${ext}`;

    // ── تحويل الملف إلى Base64 ────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer  = Buffer.from(arrayBuffer);
    const base64File  = fileBuffer.toString('base64');

    // ── إعداد الـ FormData الخاصة بطلب ImageKit API ──────────────────
    const uploadForm = new FormData();
    uploadForm.append('file', base64File);
    uploadForm.append('fileName', safeName);
    uploadForm.append('folder', imagekitFolder);

    // ── ترميز مفتاح الـ Private API للمصادقة (Basic Auth) ─────────────
    const authHeader = 'Basic ' + Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');

    console.log(`[ImageKit Upload] Uploading ${safeName} to ${imagekitFolder}...`);

    // ── إرسال الطلب لـ ImageKit REST API ─────────────────────────────
    const ikResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // دع المتصفح/Node يحدد الـ boundary الخاص بالـ multipart تلقائياً
      },
      body: uploadForm,
    });

    const result = await ikResponse.json();

    if (!ikResponse.ok) {
      console.error('[ImageKit Error Response]', result);
      throw new Error(result.message || 'فشل الرفع إلى ImageKit');
    }

    console.log(`[ImageKit Upload] ✓ Success: ${result.url}`);

    // ── الاستجابة بالصيغة القديمة المتوافقة لعدم كسر قواعد البيانات ───
    // result.url هو الرابط العام الفوري والمجاني المقدم من CDN الخاص بـ ImageKit
    return NextResponse.json({
      url:    result.url,      // ← يُحفظ في Supabase PostgreSQL مباشرة ويعمل فوراً للعامة!
      path:   result.filePath, // المسار الداخلي
      bucket: bucket,          // للتوافق مع الـ frontend
      name:   file.name,
      size:   file.size,
      type:   mimeType,
    }, { status: 201 });

  } catch (err) {
    console.error('[ImageKit Upload API Route Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
