import { IMAGEKIT_PRIVATE_KEY } from '@/lib/imagekit';
import { NextResponse } from 'next/server';

// DELETE /api/upload/delete
// Body: { path: string, bucket?: string }
//
// يقوم بحذف الملف من ImageKit. بما أن الحذف في ImageKit يتطلب معرف الملف (fileId)،
// فإننا نقوم أولاً بالبحث عن الملف باستخدام مساره (path/filePath) للحصول على الـ fileId،
// ثم نقوم بحذفه مباشرة.
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { path } = body; // path هو filePath المسترجع من الرفع (مثل: /covers/filename.jpg)

    if (!path) {
      return NextResponse.json(
        { error: 'المسار (path) مطلوب لحذف الملف' },
        { status: 400 }
      );
    }

    const filename = path.split('/').pop();
    const searchQuery = `name="${filename}"`;
    const searchUrl = `https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(searchQuery)}`;

    const authHeader = 'Basic ' + Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');

    console.log(`[ImageKit Delete] Searching for file: ${filename}...`);

    // 1. البحث عن الملف للحصول على الـ fileId
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      const searchError = await searchResponse.json();
      throw new Error(searchError.message || 'فشل البحث عن الملف في ImageKit');
    }

    const filesFound = await searchResponse.json();

    if (!filesFound || filesFound.length === 0) {
      console.warn(`[ImageKit Delete] File not found in ImageKit storage: ${path}`);
      return NextResponse.json({ success: true, deleted: path, note: 'الملف غير موجود بالفعل في التخزين' });
    }

    // إيجاد الملف المطابق تماماً للمسار
    const targetFile = filesFound.find(f => f.filePath === path) || filesFound[0];

    console.log(`[ImageKit Delete] Found target file: ${targetFile.fileId}. Deleting...`);

    // 2. إرسال طلب الحذف بـ fileId
    const deleteResponse = await fetch(`https://api.imagekit.io/v1/files/${targetFile.fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (deleteResponse.status !== 204) {
      const deleteError = await deleteResponse.json();
      throw new Error(deleteError.message || 'فشل حذف الملف من ImageKit');
    }

    console.log(`[ImageKit Delete] ✓ Deleted successfully: ${path}`);

    return NextResponse.json({ success: true, deleted: path });

  } catch (err) {
    console.error('[ImageKit Delete API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
