# AI TESTING STANDARD OPERATING PROCEDURE (SOP)

**INSTRUKSI MUTLAK UNTUK AI:**
Setiap kali selesai melakukan modifikasi kode (fitur baru, bug fix, atau refactoring), AI **DIWAJIBKAN** merujuk pada SOP ini dan mengeksekusi semua langkah pengujian berikut **sebelum melaporkan bahwa tugas selesai**.

## 🔴 LANGKAH PENGUJIAN WAJIB (JALANKAN SECARA BERURUTAN)

### 1. Uji Build & Kompilasi (Build Check)

Jalankan perintah ini untuk memastikan tidak ada error syntax, masalah import, atau type error yang menyebabkan gagal build.

```bash
npm run build
```

### 2. Uji Gaya Penulisan Kode (Lint Check)

Jalankan perintah ini untuk memastikan konsistensi dan tidak ada peringatan fatal pada kode yang baru ditulis.

```bash
npm run lint
```

### 3. Uji Runtime (Runtime Check)

Pastikan server development berjalan dan tidak mengalami error saat proses kompilasi ulang (Hot Module Replacement).

```bash
npm run dev
```

_(Cek output console, pastikan tidak ada pesan error merah saat halaman diakses)_

### 4. Uji Fungsional & API

- **Untuk UI/Halaman:** Verifikasi (dengan Browser Tool atau panduan user) bahwa halaman dapat dirender dengan sempurna, dan jelaskan langkah pengujian manualnya.
- **Untuk API/Backend:** Lakukan pengetesan request untuk memverifikasi respons JSON dan HTTP Status Code (200 OK, dll).

### 5. Uji Koneksi Database (Supabase)

Khusus untuk perubahan yang menyentuh Supabase:

- Uji query ke database secara real/simulasi.
- Pastikan Row Level Security (RLS) di-set dengan benar dan tidak memblokir query yang valid.

---

## 🛑 ATURAN STRICT / FIX FIRST

Jika terjadi **ERROR** pada salah satu dari langkah 1-5 di atas:

- **JANGAN LANJUT** membangun fitur berikutnya.
- **JANGAN ASUMSI** bahwa kode sudah benar.
- Langsung lakukan debugging dan perbaiki error tersebut hingga semua test (build & lint) berstatus **LULUS (Passed)**.

## 📝 FORMAT PELAPORAN KE USER

Setelah SOP selesai dijalankan, AI wajib menyertakan laporan berikut:

1. **Status Build:** (Lulus/Gagal & Diperbaiki)
2. **Status Lint:** (Lulus/Gagal & Diperbaiki)
3. **Hasil Uji Fungsional:** (Detail apa yang diuji dan hasilnya)
4. **Catatan:** (Sebutkan secara transparan jika ada pengujian yang terpaksa di-skip, misal karena variabel env belum disetel oleh user).
