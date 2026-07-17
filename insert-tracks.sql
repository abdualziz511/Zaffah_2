-- Sample Tracks for Studio77
-- Run this in Supabase SQL Editor

INSERT INTO public.tracks (title, artist_name, category, section, is_exclusive, audio_url, cover_image_url, description, duration) VALUES
  ('Sheela Fakhr Al-Ajyal', 'Ahmad Al-Munshid', 'sheelat', 'latest', false, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80', 'Track 1', '03:45'),
  ('Zaffet Masar Al-Aroos', 'Al-Muhandis Khalid', 'zaffat', 'exclusive', true, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80', 'Track 2', '05:20'),
  ('Nasheed Al-Noor', 'Al-Muhandis Husam', 'anasheed', 'latest', false, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=600&auto=format&fit=crop&q=80', 'Track 3', '04:10'),
  ('Sheela Al-Eid', 'Fahad Al-Mutrib', 'sheelat', 'exclusive', true, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80', 'Track 4', '04:30'),
  ('Zaffet Al-Afraa', 'Ahmad Al-Munshid', 'zaffat', 'latest', false, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80', 'Track 5', '03:55');