# PRD — Website Biddokkes Polda Sulawesi Tengah

**Product Requirements Document**
**Untuk:** Laporan KKLP — Pembuatan Website (Program Utama)
**Status saat ini di lapangan:** Biddokkes Polda Sulteng **belum punya website resmi** (dikonfirmasi kosong di seluruh direktori Pusdokkes Polri & bidkesmapta.com). Proyek ini mengisi kekosongan tersebut.
**Versi:** 1.0

---

## 1. Latar Belakang

Biddokkes (Bidang Kedokteran dan Kesehatan) Polda Sulawesi Tengah adalah unit Polri yang menangani:
- Kedokteran kepolisian & kedokteran forensik
- Identifikasi Korban Bencana (DVI)
- Kesehatan kesamaptaan personel Polri
- Pelayanan kesehatan (Poliklinik & Rumkit Bhayangkara)
- Kesehatan lalu lintas, kesehatan narkoba, kesehatan tahanan
- Layanan kesehatan untuk personel Polri, keluarga, **dan masyarakat umum**

Dibandingkan instansi sejenis di provinsi lain (contoh: Biddokkes Polda Sulut yang sudah punya website lengkap berisi MCU, vaksinasi, lab, psikologi, ambulans, medikolegal, DVI, reservasi, dan FAQ), Biddokkes Sulteng tidak memiliki kehadiran digital apa pun untuk publik. Website ini dibangun untuk menutup kesenjangan tersebut sekaligus menjadi Program Utama KKLP.

## 2. Tujuan Produk

1. Memberi masyarakat & personel Polri akses informasi resmi tentang layanan kesehatan Biddokkes Sulteng.
2. Menyediakan kanal digital tepercaya (mengurangi risiko penipuan mengatasnamakan petugas).
3. Memberi admin instansi kemampuan mengelola konten sendiri (berita, galeri kegiatan) tanpa perlu bantuan programmer — lewat panel admin CRUD.
4. Menjadi contoh nyata transformasi digital pelayanan publik Polri di tingkat Polda.

## 3. Target Pengguna

| Peran | Kebutuhan |
|---|---|
| **Masyarakat umum** | Cari info layanan, syarat dokumen, lokasi, kontak, jadwal kegiatan kesehatan |
| **Personel Polri & keluarga** | Info MCU, kesamaptaan, kesehatan berkala |
| **Penyidik / instansi mitra** | Prosedur permohonan visum et repertum (medikolegal) |
| **Admin Biddokkes** (Kasubbag/petugas humas) | Login, unggah foto/video kegiatan, tulis & hapus berita, tanpa coding |

## 4. Lingkup Fitur (Scope)

### 4.1 Halaman Publik (tanpa login)
- **Beranda** — hero, navigasi cepat gaya *wayfinding* rumah sakit, ringkasan layanan
- **Tentang** — profil, tugas & fungsi, struktur singkat, nilai Tribrata Polri
- **Layanan** — 7 kartu layanan lengkap (lihat `CONTENT-SITEMAP.md`)
- **Prosedur & Syarat** — accordion per layanan (dokumen, alur, estimasi waktu)
- **Galeri** — foto & video kegiatan (dari database, bisa berkembang lewat admin)
- **Berita & Pengumuman** — daftar berita (dari database)
- **FAQ** — accordion tanya-jawab umum
- **Lokasi & Kontak** — peta interaktif (Google Maps embed gratis), alamat, telepon, WhatsApp, jam layanan
- **Footer** — disclaimer anti-penipuan, tautan resmi, identitas Polri

### 4.2 Panel Admin (`/admin`, login wajib)
- Login (Supabase Auth — email & password, gratis, aman)
- **CRUD Galeri**: tambah (upload foto/video), lihat daftar, edit judul/deskripsi, hapus
- **CRUD Berita**: tambah (judul, isi, gambar sampul opsional), edit, hapus, tandai publish/draft
- Semua perubahan langsung tampil di halaman publik (real-time via Supabase)

### 4.3 Di luar lingkup (v1)
- Reservasi/antrean online (bisa jadi pengembangan lanjutan — v2)
- Multi-bahasa
- Aplikasi mobile terpisah

## 5. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| **Biaya** | Rp 0 — seluruh stack pakai tingkat gratis (Vercel + Supabase) |
| **Kecepatan** | Lighthouse Performance ≥ 90, first load < 2 detik |
| **Aksesibilitas** | Kontras warna cukup, fokus keyboard terlihat, `prefers-reduced-motion` dihormati |
| **Responsif** | Mobile-first, breakpoint 400px / 720px / 900px / 1200px |
| **Keamanan** | RLS (Row Level Security) Supabase aktif — publik hanya boleh baca, tulis hanya lewat akun admin login |
| **SEO dasar** | Meta title/description, struktur heading benar, sitemap otomatis Next.js |

## 6. Arah Desain (ringkas — detail di `DESIGN-SYSTEM.md`)

Kesan yang harus terasa di setiap halaman: **rumah sakit + Polri**, bukan salah satu saja.
- **Kesan rumah sakit/kesehatan**: dominan **putih & terang**, banyak *whitespace*, aksen tosca/teal (identik dengan seragam & signage medis), ikon medis (palang, stetoskop, ambulans)
- **Kesan Polri**: navy tua (biru dongker khas Polri) dan **emas** (warna bintang Tribrata) sebagai aksen struktural — dipakai di header, footer, badge, bukan di seluruh body agar tidak terasa gelap/kaku
- Motif navigasi khas: strip *signage* koridor rumah sakit (chip arah bernomor, seperti papan penunjuk ruangan)
- Animasi halus: reveal saat scroll, hover state kartu, transisi accordion, hitung mundur/hitung naik pada angka statistik, bukan animasi berlebihan

## 7. Metrik Keberhasilan (untuk laporan KKLP)

- Website live & bisa diakses publik (Vercel URL atau domain)
- Admin bisa CRUD tanpa bantuan mahasiswa (uji coba di depan pembimbing lapangan)
- Seluruh 7 layanan Biddokkes terdokumentasi dengan prosedur jelas
- Skor Lighthouse ditampilkan sebagai bukti performa di laporan

## 8. Dokumen Terkait
- `ARCHITECTURE.md` — stack teknis & alur data
- `DESIGN-SYSTEM.md` — token warna, tipografi, komponen, spesifikasi animasi
- `DATABASE-SCHEMA.md` — struktur tabel Supabase
- `CONTENT-SITEMAP.md` — semua isi/copy tiap halaman & layanan
- `README.md` — cara install & jalankan proyek
