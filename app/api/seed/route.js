import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/seed — إدخال بيانات تجريبية
// ⚠️ احذف هذا الملف بعد الانتهاء
export async function GET() {
  try {
    const supabase = createServerClient();

    // أولاً: تحقق من الاتصال
    const { error: pingError } = await supabase.from('artists').select('count').limit(1);
    if (pingError) {
      return NextResponse.json({ step: 'ping', error: pingError.message }, { status: 500 });
    }

    // إدخال tracks تجريبية
    const tracks = [
      {
        title: 'شيلة فخر الأجيال',
        artist_name: 'أحمد المنشد',
        category: 'sheelat',
        section: 'latest',
        is_exclusive: false,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
        description: 'شيلة حماسية',
        duration: '03:45',
        filters: ['شيلات', 'مع موسيقى'],
      },
      {
        title: 'زفة الأفراح الكبرى',
        artist_name: 'المهندس خالد',
        category: 'zaffat',
        section: 'exclusive',
        is_exclusive: true,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        cover_image_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80',
        description: 'زفة ملكية مع موسيقى',
        duration: '05:20',
        filters: ['زفات', 'مع موسيقى'],
      },
      {
        title: 'نشيد النور',
        artist_name: 'المهندس حسام',
        category: 'anasheed',
        section: 'latest',
        is_exclusive: false,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover_image_url: 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=600&auto=format&fit=crop&q=80',
        description: 'نشيد إسلامي',
        duration: '04:10',
        filters: ['أناشيد', 'بدون موسيقى'],
      },
      {
        title: 'شيلة العيد الذهبية',
        artist_name: 'فهد المطرب',
        category: 'sheelat',
        section: 'exclusive',
        is_exclusive: true,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        cover_image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
        description: 'شيلة عيد',
        duration: '04:30',
        filters: ['شيلات', 'مع موسيقى'],
      },
      {
        title: 'زفة الأميرة',
        artist_name: 'أحمد المنشد',
        category: 'zaffat',
        section: 'latest',
        is_exclusive: false,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        cover_image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
        description: 'زفة خليجية',
        duration: '03:55',
        filters: ['زفات', 'بدون موسيقى'],
      },
    ];

    const { data: insertedTracks, error: tracksError } = await supabase
      .from('tracks')
      .upsert(tracks, { onConflict: 'title' })
      .select();

    if (tracksError) {
      return NextResponse.json({ step: 'tracks', error: tracksError.message }, { status: 500 });
    }

    // coming_soon
    const coming = [
      { title: 'ألبوم العيد الذهبي', description: 'مجموعة شيلات حصرية', image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80', sort_order: 1 },
      { title: 'زفة الأميرة', description: 'زفة خاصة بأجمل الأصوات', image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&auto=format&fit=crop&q=80', sort_order: 2 },
      { title: 'نشيد الوطن', description: 'نشيد وطني مجيد', image_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=1200&auto=format&fit=crop&q=80', sort_order: 3 },
    ];

    const { error: comingError } = await supabase
      .from('coming_soon')
      .upsert(coming, { onConflict: 'title' });

    // artists
    const artists = [
      { name: 'أحمد المنشد',  specialty: 'منشد ومؤدي زفات',   description: 'أعذب الأصوات',   image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', is_featured: true },
      { name: 'فهد المطرب',   specialty: 'مطرب وملحن شعبي',   description: 'خبير المقامات',   image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', is_featured: true },
      { name: 'المهندس حسام', specialty: 'مهندس صوت وتوزيع',  description: 'ماسترينغ احترافي', image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80', is_featured: true },
      { name: 'المهندس خالد', specialty: 'توزيع موسيقي ومكس',  description: 'كورال وآلات حية', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80', is_featured: true },
    ];

    const { error: artistsError } = await supabase
      .from('artists')
      .upsert(artists, { onConflict: 'name' });

    // filters
    const filters = [
      { label: 'شيلات' }, { label: 'زفات' }, { label: 'أناشيد' },
      { label: 'مع موسيقى' }, { label: 'بدون موسيقى' },
    ];

    const { error: filtersError } = await supabase
      .from('filters')
      .upsert(filters, { onConflict: 'label' });

    return NextResponse.json({
      success: true,
      inserted: {
        tracks: insertedTracks?.length || 0,
        coming_soon: !comingError,
        artists: !artistsError,
        filters: !filtersError,
      },
      errors: {
        coming: comingError?.message,
        artists: artistsError?.message,
        filters: filtersError?.message,
      }
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
