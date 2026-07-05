"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

const CONTACT_CARDS = [
  {
    icon: "📍",
    title: "Alamat",
    lines: [
      "Jl. Sam Ratulangi No. 05, Besusu Barat,",
      "Kec. Palu Timur, Kota Palu,",
      "Sulawesi Tengah 94118",
    ],
  },
  {
    icon: "🕐",
    title: "Jam Layanan",
    lines: [
      "Senin – Jumat: 08.00 – 15.00 WITA",
      "Sabtu: 08.00 – 12.00 WITA",
      "Gawat Darurat & Ambulans: Siaga 24 Jam",
    ],
  },
  {
    icon: "📞",
    title: "Telepon & WhatsApp",
    lines: ["(0451) XXX-XXXX", "WhatsApp: 0812-XXXX-XXXX"],
  },
  {
    icon: "✉️",
    title: "Email",
    lines: ["biddokkes@sulteng.polri.go.id"],
  },
];

export default function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!supabase) {
        throw new Error("Koneksi database (Supabase) belum dikonfigurasi.");
      }

      // 1. Simpan ke database Supabase (Agar muncul di Admin Panel)
      const { error: dbError } = await supabase
        .from("pesan_kontak")
        .insert([
          {
            nama: form.nama,
            email: form.email,
            pesan: form.pesan,
          }
        ]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        setErrorMsg("Gagal menyimpan pesan ke database.");
        return;
      }

      // 2. Kirim ke Email via Web3Forms (opsional tapi disarankan)
      // Jika Anda belum punya access key, bagian ini akan diabaikan (error di-catch), 
      // tetapi pesan TETAP masuk ke Admin Panel.
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "YOUR_ACCESS_KEY_HERE", // GANTI DENGAN ACCESS KEY DARI EMAIL ANDA
            subject: "Pesan Baru dari Website Biddokkes",
            name: form.nama,
            email: form.email,
            message: form.pesan,
          }),
        });
      } catch (emailErr) {
        console.log("Email notification failed, but message saved to DB", emailErr);
      }

      // Berhasil
      setSent(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Kontak — Biddokkes Polda Sulteng</title>
      <Header />

      <main className="min-h-screen pt-20" style={{ background: "var(--color-paper)" }}>

        {/* ── Page Hero ── */}
        <div className="py-16 sm:py-20 text-center" style={{ background: "#0B2340" }}>
          <p className="text-xs tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: "#D9A441", fontFamily: "var(--font-mono)" }}>
            Hubungi Kami
          </p>
          <h1 className="text-3xl sm:text-5xl font-black mb-3" style={{ color: "#FFFFFF", fontFamily: "var(--font-display)" }}>
            Lokasi &amp; Kontak
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-base max-w-xl mx-auto px-4">
            Tim kami siap membantu. Kunjungi langsung atau kirim pesan melalui formulir di bawah.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

          {/* ── Contact Cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {CONTACT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5"
                style={{ background: "var(--color-white)", border: "1px solid var(--color-line)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <p className="text-2xl mb-3">{card.icon}</p>
                <p className="font-bold text-sm mb-2" style={{ color: "var(--color-navy-900)" }}>{card.title}</p>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-sm" style={{ color: "var(--color-ink-500)" }}>{line}</p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* ── Map + Form ── */}
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Map */}
            <div>
              <p className="font-bold mb-3" style={{ color: "var(--color-navy-900)" }}>📍 Temukan Kami</p>
              <div className="rounded-2xl overflow-hidden shadow-md" style={{ border: "1px solid var(--color-line)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.434!2d119.8707!3d-0.8917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTMnMzAuMSJTIDExOcKwNTInMTQuNSJF!5e0!3m2!1sid!2sid!4v1"
                  width="100%"
                  height="380"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Biddokkes Polda Sulteng"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <p className="font-bold mb-3" style={{ color: "var(--color-navy-900)" }}>✉️ Kirim Pesan</p>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: "var(--color-white)", border: "1px solid var(--color-line)" }}
                >
                  <p className="text-4xl mb-3">✅</p>
                  <p className="font-bold text-lg mb-2" style={{ color: "var(--color-navy-900)" }}>Pesan Terkirim!</p>
                  <p className="text-sm mb-6" style={{ color: "var(--color-ink-500)" }}>
                    Terima kasih, kami akan segera menghubungi Anda.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nama: "", email: "", pesan: "" }); }}
                    className="px-6 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "#0E8C82", color: "white" }}
                  >
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-6 space-y-4"
                  style={{ background: "var(--color-white)", border: "1px solid var(--color-line)" }}
                >
                  {errorMsg && (
                    <div className="p-3 rounded-lg text-sm font-semibold" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                      ⚠️ {errorMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "var(--color-ink-500)" }}>Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{ border: "1px solid var(--color-line)", background: "var(--color-paper)", color: "var(--color-ink-900)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "var(--color-ink-500)" }}>Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@contoh.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm"
                      style={{ border: "1px solid var(--color-line)", background: "var(--color-paper)", color: "var(--color-ink-900)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "var(--color-ink-500)" }}>Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={form.pesan}
                      onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                      placeholder="Tuliskan pesan atau pertanyaan Anda..."
                      className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                      style={{ border: "1px solid var(--color-line)", background: "var(--color-paper)", color: "var(--color-ink-900)" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#0E8C82", color: "white" }}
                  >
                    {loading ? "Mengirim..." : "Kirim Pesan 📨"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Back button ── */}
          <div className="mt-14 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: "#0B2340", color: "white" }}
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
