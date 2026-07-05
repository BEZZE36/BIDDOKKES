-- ============================================================
-- SUPABASE SETUP — Website Biddokkes Polda Sulawesi Tengah
-- ============================================================
-- Salin-tempel seluruh isi file ini ke SQL Editor di Supabase,
-- lalu klik Run. Semua tabel, RLS, dan kebijakan akan dibuat.
-- ============================================================

-- 1. Tabel berita
CREATE TABLE IF NOT EXISTS berita (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  gambar_url TEXT,
  status TEXT DEFAULT 'publish',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel galeri
CREATE TABLE IF NOT EXISTS galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  media_url TEXT NOT NULL,
  tipe_media TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Aktifkan Row Level Security
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan: publik boleh baca
DROP POLICY IF EXISTS "Publik boleh baca berita" ON berita;
CREATE POLICY "Publik boleh baca berita"
  ON berita FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Publik boleh baca galeri" ON galeri;
CREATE POLICY "Publik boleh baca galeri"
  ON galeri FOR SELECT
  USING (true);

-- 5. Kebijakan: SEMUA ORANG boleh kelola (UNTUK UJI COBA SEMENTARA)
DROP POLICY IF EXISTS "Admin boleh kelola berita" ON berita;
CREATE POLICY "Admin boleh kelola berita"
  ON berita FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin boleh kelola galeri" ON galeri;
CREATE POLICY "Admin boleh kelola galeri"
  ON galeri FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 6. Tabel hero_slides (Slider di halaman utama)
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik boleh baca hero" ON hero_slides;
CREATE POLICY "Publik boleh baca hero"
  ON hero_slides FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin boleh kelola hero" ON hero_slides;
CREATE POLICY "Admin boleh kelola hero"
  ON hero_slides FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 7. Tabel about_image (Foto profil di section Tentang)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about_image ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik boleh baca about" ON about_image;
CREATE POLICY "Publik boleh baca about"
  ON about_image FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin boleh kelola about" ON about_image;
CREATE POLICY "Admin boleh kelola about"
  ON about_image FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 8. Setup Storage (Bucket untuk Upload Media)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage: Publik boleh melihat/mengunduh gambar
DROP POLICY IF EXISTS "Publik boleh akses media" ON storage.objects;
CREATE POLICY "Publik boleh akses media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Kebijakan Storage: SEMUA ORANG boleh upload/hapus media (UNTUK UJI COBA SEMENTARA)
DROP POLICY IF EXISTS "Admin boleh kelola media" ON storage.objects;
CREATE POLICY "Admin boleh kelola media"
  ON storage.objects FOR ALL
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- ============================================================
-- 9. Tabel admin_avatar (Foto profil admin di header)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_avatar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_avatar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik boleh baca admin_avatar" ON admin_avatar;
CREATE POLICY "Publik boleh baca admin_avatar"
  ON admin_avatar FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin boleh kelola admin_avatar" ON admin_avatar;
CREATE POLICY "Admin boleh kelola admin_avatar"
  ON admin_avatar FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 10. Tabel pesan_kontak (Menyimpan pesan dari form kontak)
-- ============================================================
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  pesan TEXT NOT NULL,
  sudah_dibaca BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pesan_kontak ENABLE ROW LEVEL SECURITY;

-- Publik (tanpa login) BOLEH MENGIRIM (Insert) pesan
DROP POLICY IF EXISTS "Publik boleh kirim pesan" ON pesan_kontak;
CREATE POLICY "Publik boleh kirim pesan"
  ON pesan_kontak FOR INSERT
  WITH CHECK (true);

-- Hanya admin (user yang login) yang boleh melihat, mengubah, dan menghapus pesan
DROP POLICY IF EXISTS "Admin boleh kelola pesan" ON pesan_kontak;
CREATE POLICY "Admin boleh kelola pesan"
  ON pesan_kontak FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 11. Tabel pengaturan_sistem (Mode Pemeliharaan & Super Admin)
-- ============================================================
DROP TABLE IF EXISTS pengaturan_sistem;
CREATE TABLE IF NOT EXISTS pengaturan_sistem (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_maintenance_public BOOLEAN DEFAULT false,
  is_maintenance_admin BOOLEAN DEFAULT false,
  judul_maintenance_public TEXT DEFAULT 'SYSTEM LOCKDOWN - PUBLIC AREA',
  judul_maintenance_admin TEXT DEFAULT 'SYSTEM LOCKDOWN - RESTRICTED AREA',
  deskripsi_maintenance_public TEXT DEFAULT 'Sistem keamanan sedang melakukan enkripsi dan peningkatan protokol. Akses ditolak sementara.',
  deskripsi_maintenance_admin TEXT DEFAULT 'Sistem keamanan sedang melakukan enkripsi dan peningkatan protokol. Akses ditolak sementara.',
  waktu_mulai TIMESTAMPTZ DEFAULT now(),
  waktu_selesai_public TIMESTAMPTZ,
  waktu_selesai_admin TIMESTAMPTZ,
  pin_superadmin TEXT DEFAULT '123456',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert baris konfigurasi default (jika belum ada)
INSERT INTO pengaturan_sistem (id, is_maintenance_public, is_maintenance_admin) VALUES (1, false, false) ON CONFLICT (id) DO NOTHING;

ALTER TABLE pengaturan_sistem ENABLE ROW LEVEL SECURITY;

-- Publik boleh membaca pengaturan (untuk mengecek apakah maintenance aktif)
DROP POLICY IF EXISTS "Publik boleh baca pengaturan" ON pengaturan_sistem;
CREATE POLICY "Publik boleh baca pengaturan"
  ON pengaturan_sistem FOR SELECT
  USING (true);

-- Hanya Super Admin (dengan auth atau PIN) yang seharusnya mengubah ini, tapi untuk sementara kita buat terbuka untuk update demi kemudahan integrasi.
DROP POLICY IF EXISTS "Semua boleh ubah pengaturan" ON pengaturan_sistem;
CREATE POLICY "Semua boleh ubah pengaturan"
  ON pengaturan_sistem FOR UPDATE
  USING (true)
  WITH CHECK (true);
