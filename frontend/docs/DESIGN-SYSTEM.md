# DESIGN SYSTEM — Website Biddokkes Polda Sulawesi Tengah

## 1. Arah Desain

**Brief:** kesan rumah sakit (bersih, putih, menenangkan) **dan** kesan Polri (tegas, navy, emas Tribrata) harus terasa bersama — bukan salah satu mendominasi.

**Cara mencapainya:**
- **Badan halaman (body) didominasi putih/terang** → kesan klinik/rumah sakit: lapang, bersih, tepercaya secara medis.
- **Navy + emas dipakai terstruktur** di header, footer, badge, garis aksen, ikon-ikon kunci → kesan institusi Polri tanpa membuat halaman terasa gelap/kaku.
- **Teal/tosca** sebagai warna layanan medis (identik warna seragam nakes/signage klinik) untuk ikon & kategori layanan.
- Motif navigasi: **signage koridor rumah sakit** (chip bernomor, panah arah) — elemen asli dari dunia rumah sakit, dipakai sebagai signature, bukan dekorasi generik.
- Lambang kehormatan Polri (nilai **Tribrata & Catur Prasetya**) disebut di bagian "Tentang" sebagai penguat identitas institusional, ditulis dengan hormat dan proporsional (bukan dekorasi berlebihan).

## 2. Palet Warna

| Token | Hex | Peran |
|---|---|---|
| `white` | `#FFFFFF` | Latar utama (dominan) — kesan rumah sakit |
| `paper` | `#F7FAFA` | Latar section alternatif, sangat terang, sedikit rona tosca |
| `mist` | `#EFF6F5` | Latar blok lembut (card, highlight) |
| `navy-900` | `#0B2340` | Identitas Polri — header, footer, teks judul besar |
| `navy-700` | `#14315A` | Varian navy untuk hover/gradient |
| `gold-500` | `#D9A441` | Emas Tribrata — aksen garis, badge, ikon kehormatan |
| `gold-600` | `#B9872C` | Hover/varian gelap emas |
| `teal-600` | `#0E8C82` | Warna medis utama — ikon layanan, tombol utama |
| `teal-700` | `#0B6F67` | Hover teal |
| `teal-100` | `#E1F3F1` | Latar ikon/badge medis |
| `ink-900` | `#16202B` | Teks utama |
| `ink-500` | `#5C6B72` | Teks sekunder/deskripsi |
| `line` | `#E4EAEC` | Garis pembatas tipis |

> Perubahan dari draf sebelumnya: warna amber diganti **gold** (lebih presisi merepresentasikan emas Tribrata Polri, bukan warna "hangat" generik), dan proporsi putih pada body ditambah signifikan (sebelumnya banyak blok navy tebal) — sekarang navy hanya di header, footer, dan aksen, bukan latar section.

## 3. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display (judul besar) | **Fraunces** (serif, opsz axis) | Berkarakter, terasa institusional & terpercaya — dipakai terbatas di judul |
| Body | **Plus Jakarta Sans** | Sangat terbaca, modern, netral — cocok untuk info medis yang harus jelas |
| Mono/label | **IBM Plex Mono** | Untuk label kode, nomor loket, eyebrow — kesan "sistem/administratif" khas instansi |

Skala: H1 `clamp(2.1rem,4vw,3.2rem)`, H2 `~2rem`, H3 `~1.15rem`, body `1rem`, caption `0.8rem`.

## 4. Komponen Kunci

- **Header**: putih transparan-blur saat scroll, logo lambang (placeholder bulat navy+gold), garis bawah emas tipis 2px sebagai identitas Polri yang halus.
- **Signage strip**: baris horizontal scroll berisi 7 chip layanan, tiap chip warna beda (dikodekan per kategori layanan — mirip papan arah rumah sakit sungguhan), nomor loket bergaya mono font.
- **Kartu layanan**: latar putih, border tipis, ikon di kotak warna teal-100, judul Fraunces, cukup banyak whitespace.
- **Badge Tribrata**: elemen kecil di section "Tentang" — bentuk perisai sederhana (CSS, bukan gambar berhak cipta) warna navy+gold, teks "TRIBRATA" mono kecil.
- **Footer**: satu-satunya blok navy penuh di halaman selain header — representasi "identitas resmi Polri" di penutup halaman, kontras dengan body yang putih terang.

## 5. Spesifikasi Animasi

| Elemen | Animasi | Durasi/Easing |
|---|---|---|
| Hero (saat halaman dimuat) | Fade + slide-up berurutan: eyebrow → judul → deskripsi → tombol → panel kanan | 500–700ms, `ease-out`, jeda antar elemen 80ms |
| Signage strip | Chip pertama kali muncul dengan stagger fade-in dari kiri | 400ms per chip, delay bertahap 60ms |
| Section saat discroll | Reveal fade + translateY(16px→0) via `IntersectionObserver` | 500ms `ease-out`, trigger sekali |
| Angka statistik ("7 layanan", "24 jam", dst.) | Count-up dari 0 ke nilai asli saat pertama kali terlihat | 900ms `ease-out` |
| Kartu layanan/berita | Hover: naik 2px + shadow membesar + ikon sedikit scale 1.05 | 150ms `ease` |
| Accordion (Prosedur & FAQ) | Expand/collapse tinggi otomatis + ikon plus rotate 45° | 220ms `ease` |
| Galeri (admin upload sukses) | Item baru fade+scale masuk ke grid | 300ms |
| Tombol utama | Hover: warna gelap + translateY(-1px) + shadow pop | 150ms |
| Global | **`prefers-reduced-motion: reduce`** → semua animasi di atas dinonaktifkan/dipercepat ke ~0ms | wajib dihormati |

Prinsip: animasi menandai *perubahan status* (muncul, berhasil, berinteraksi) — tidak ada animasi ambient/looping yang mengalihkan perhatian dari informasi kesehatan yang serius.

## 6. Aksesibilitas & Kualitas Minimum

- Kontras teks ≥ 4.5:1 di seluruh kombinasi warna di atas
- Semua elemen interaktif punya `:focus-visible` (outline emas 3px)
- Semua gambar punya `alt` text deskriptif
- Struktur heading berurutan (H1 sekali per halaman, H2 per section, H3 per item)
- Layout responsif turun sampai lebar 360px tanpa horizontal scroll (kecuali signage strip yang memang didesain scrollable)
