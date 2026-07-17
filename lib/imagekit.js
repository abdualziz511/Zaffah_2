// ── إعدادات ImageKit ──────────────────────────────────────────────────────
export const IMAGEKIT_PUBLIC_KEY   = process.env.IMAGEKIT_PUBLIC_KEY;
export const IMAGEKIT_PRIVATE_KEY  = process.env.IMAGEKIT_PRIVATE_KEY;
export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  console.error(
    '[ImageKit] Missing required env vars: IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT'
  );
}

// ── خريطة تنظيم المجلدات داخل ImageKit Media Library ──────────────────────
// سيتم إنشاء هذه المجلدات تلقائياً داخل حسابك في ImageKit عند الرفع
export const IMAGEKIT_FOLDER_MAP = {
  'cover-images':  '/covers',
  'cover-images1': '/covers',
  'audio-tracks':  '/tracks',
};
