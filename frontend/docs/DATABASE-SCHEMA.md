# DATABASE SCHEMA — Supabase (PostgreSQL)

## 1. Tabel `berita`

Menyimpan berita/pengumuman yang dikelola admin lewat CRUD.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid`, primary key, default `gen_random_uuid()` | ID unik |
| `judul` | `text`, not null | Judul berita |
| `isi` | `text`, not null | Isi lengkap berita |
| `gambar_url` | `text`, nullable | URL gambar sampul (dari Supabase Storage) |
| `status` | `text`, default `'publish'` | `'publish'` atau `'draft'` |
| `created_at` | `timestamptz`, default `now()` | Waktu dibuat |
| `updated_at` | `timestamptz`, default `now()` | Waktu diubah terakhir |

## 2. Tabel `galeri`

Menyimpan foto/video kegiatan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid`, primary key, default `gen_random_uuid()` | ID unik |
| `judul` | `text`, not null | Judul/keterangan singkat |
| `deskripsi` | `text`, nullable | Deskripsi kegiatan |
| `media_url` | `text`, not null | URL file (dari Supabase Storage bucket `media`) |
| `tipe_media` | `text`, not null | `'gambar'` atau `'video'` |
| `created_at` | `timestamptz`, default `now()` | Waktu diunggah |

## 3. Storage Bucket: `media`

- Menyimpan file asli foto/video yang diunggah admin
- Struktur folder di dalam bucket: `galeri/` (untuk galeri), `berita/` (untuk gambar sampul)
- Batas ukuran disarankan: gambar maks 5MB, video maks 50MB (agar tetap dalam kuota gratis 1GB dan loading cepat)
- Format didukung: `.jpg .jpeg .png .webp` untuk gambar, `.mp4 .webm` untuk video

## 4. Kebijakan Keamanan (Row Level Security)

Prinsip: **siapa saja boleh membaca, hanya admin login yang boleh mengubah.**

```sql
-- Aktifkan RLS
alter table berita enable row level security;
alter table galeri enable row level security;

-- Semua orang (termasuk pengunjung belum login) boleh membaca
create policy "Publik boleh baca berita"
  on berita for select
  using ( true );

create policy "Publik boleh baca galeri"
  on galeri for select
  using ( true );

-- Hanya user yang sudah login (admin) boleh menambah/mengubah/menghapus
create policy "Admin boleh kelola berita"
  on berita for all
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );

create policy "Admin boleh kelola galeri"
  on galeri for all
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );
```

Kebijakan Storage bucket `media` (diatur lewat dashboard Supabase > Storage > Policies):
- **SELECT** (lihat/unduh file): publik (`true`)
- **INSERT/UPDATE/DELETE**: hanya `authenticated`

## 5. Diagram Relasi (sederhana)

```
auth.users (bawaan Supabase — akun admin)
        │
        │  (yang login = boleh tulis)
        ▼
   ┌─────────┐      ┌─────────┐
   │ berita  │      │ galeri  │
   └─────────┘      └─────────┘
        │                 │
        └──────┬──────────┘
               ▼
     Storage bucket "media"
     (file foto/video asli)
```

Tidak ada relasi foreign key antar tabel — struktur sengaja dibuat sederhana (flat) karena kebutuhan kontennya juga sederhana, sesuai prinsip "match complexity to the need" agar mudah dipahami admin non-teknis dan mudah dirawat mahasiswa lain setelah KKLP selesai.

## 6. Catatan Migrasi

Skrip SQL siap-jalan (tabel + RLS sekaligus) ada di file `supabase-setup.sql` di root proyek — tinggal salin-tempel ke **SQL Editor** Supabase lalu klik Run.
