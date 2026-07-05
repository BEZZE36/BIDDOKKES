# ARCHITECTURE — Website Biddokkes Polda Sulawesi Tengah

## 1. Stack Teknologi (100% gratis)

| Lapisan | Teknologi | Alasan |
|---|---|---|
| Framework | **Next.js 14** (App Router, JavaScript) | Interaktif, cepat (server-side render + edge CDN), gratis di Vercel |
| Styling | **Tailwind CSS** | Konsisten dengan token desain, ringan, cepat dikembangkan |
| Backend/API | **Next.js Route Handlers** + **Supabase JS SDK langsung dari client** | Tidak perlu server terpisah |
| Database | **Supabase (PostgreSQL)** | Gratis, relational, aman dengan Row Level Security |
| Storage foto/video | **Supabase Storage** (bucket `media`) | Gratis hingga 1GB, terhubung langsung ke database |
| Autentikasi admin | **Supabase Auth** (email + password) | Gratis, aman, tidak perlu bikin sistem login sendiri |
| Peta | **Google Maps Embed** (iframe, tanpa API key) | Gratis tanpa batas untuk kebutuhan tampilan lokasi |
| Font | **Google Fonts** (Fraunces, Plus Jakarta Sans, IBM Plex Mono) via `next/font` | Gratis, otomatis dioptimasi Next.js (tidak ada layout shift) |
| Hosting | **Vercel** (Hobby plan) | Gratis selamanya untuk proyek non-komersial, CDN global, auto-deploy dari GitHub |
| Versioning | **GitHub** | Gratis, terhubung otomatis ke Vercel (setiap push = deploy otomatis) |

**Biaya total: Rp 0/bulan**, selama traffic wajar (batas gratis Supabase & Vercel jauh di atas kebutuhan situs instansi kecil).

## 2. Struktur Folder

```
biddokkes-next/
├── docs/                        # dokumentasi (PRD, desain, database, konten)
├── app/
│   ├── layout.js                # layout root: font, metadata SEO
│   ├── globals.css              # Tailwind + custom base styles
│   ├── page.js                  # Beranda (menyusun semua komponen publik)
│   └── admin/
│       ├── page.js               # Halaman login admin
│       └── dashboard/
│           └── page.js           # Panel CRUD (Galeri & Berita)
├── components/
│   ├── Header.jsx                # Nav + strip signage wayfinding
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Services.jsx               # 7 kartu layanan
│   ├── Procedures.jsx             # Accordion prosedur & syarat
│   ├── Gallery.jsx                # Ambil data dari Supabase (read-only)
│   ├── News.jsx                   # Ambil data dari Supabase (read-only)
│   ├── FAQ.jsx
│   ├── Location.jsx               # Peta + kontak
│   ├── Footer.jsx
│   ├── AdminLoginForm.jsx
│   ├── AdminGalleryManager.jsx    # CRUD galeri (upload ke Storage)
│   ├── AdminNewsManager.jsx       # CRUD berita
│   └── ScrollReveal.jsx           # util animasi reveal-on-scroll
├── lib/
│   └── supabaseClient.js         # inisialisasi Supabase client
├── public/                        # aset statis (logo, favicon)
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── supabase-setup.sql             # skrip SQL siap-jalan untuk Supabase
└── README.md
```

## 3. Alur Data (Data Flow)

### Baca (publik — Beranda)
```
Browser  →  Next.js Server Component  →  Supabase (select, RLS: publik boleh baca)
         ←  HTML sudah jadi (cepat, SEO-friendly)
```

### Tulis (admin — Dashboard)
```
Admin login  →  Supabase Auth  →  dapat token sesi
Admin upload file →  Supabase Storage (bucket "media") →  dapat URL publik
Admin simpan data →  Supabase Database (tabel galeri/berita, RLS: hanya user login boleh insert/update/delete)
                  →  Halaman publik otomatis menampilkan data terbaru (fetch ulang / realtime)
```

## 4. Keamanan (Row Level Security)

- Tabel `galeri` dan `berita`: **SELECT** boleh untuk siapa saja (`anon`), **INSERT/UPDATE/DELETE** hanya untuk role `authenticated` (admin yang sudah login).
- Bucket Storage `media`: **read** publik, **write** hanya `authenticated`.
- Kunci `anon` Supabase aman dipakai di frontend (memang didesain publik) — keamanan sebenarnya ada di kebijakan RLS, bukan di kunci tersebut.

## 5. Rencana Deploy

1. Push kode ke repository GitHub (gratis)
2. Hubungkan repo ke Vercel → Import Project
3. Isi Environment Variables di Vercel (sama seperti `.env.local`)
4. Deploy otomatis → dapat URL `namaproyek.vercel.app` (bisa dipasang domain sendiri nanti jika instansi punya, misal `.go.id`)
5. Setiap ada perubahan kode di GitHub, Vercel otomatis build & deploy ulang (tidak perlu upload manual)

## 6. Skalabilitas Konten (tanpa sentuh kode)

- Tambah/edit/hapus **berita** dan **galeri** → lewat panel admin, real-time
- Ubah **teks layanan, FAQ, prosedur** → edit di `CONTENT-SITEMAP.md` sebagai sumber kebenaran, lalu salin ke komponen terkait (karena ini konten institusional yang jarang berubah, sengaja tidak dibuatkan CRUD terpisah agar sistem tetap sederhana dan cepat dipahami admin non-teknis)
