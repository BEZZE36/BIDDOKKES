"use client";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "Apakah layanan Biddokkes bisa diakses masyarakat umum, atau hanya untuk anggota Polri?", a: "Sebagian layanan (seperti Poliklinik, laboratorium, dan MCU) terbuka untuk masyarakat umum selain personel Polri dan keluarga. Layanan tertentu seperti medikolegal mengikuti prosedur khusus melalui penyidik." },
  { q: "Bagaimana cara mengajukan permintaan Visum et Repertum (VER)?", a: "Permohonan visum diajukan melalui penyidik sesuai ketentuan medikolegal yang berlaku, bukan langsung oleh perseorangan." },
  { q: "Apakah hasil laboratorium bisa dipakai untuk keperluan administrasi (kerja, SIM, dll.)?", a: "Bisa. Hasil resmi diterbitkan sesuai kebutuhan dan ketersediaan jenis pemeriksaan yang diajukan." },
  { q: "Bagaimana jadwal vaksinasi terbaru?", a: "Jadwal kegiatan vaksinasi dan program kesehatan lain diumumkan berkala di bagian Berita & Pengumuman pada halaman ini." },
  { q: "Bagaimana cara memastikan saya berhubungan dengan petugas resmi, bukan penipuan?", a: "Gunakan hanya kontak resmi yang tercantum di bagian Lokasi & Kontak pada situs ini. Pembayaran (jika ada) hanya dilakukan lewat kanal resmi di loket, dengan bukti tertulis. Jangan pernah transfer ke pihak yang mengaku \"bisa mempercepat layanan\"." },
  { q: "Apakah tersedia layanan darurat di luar jam kerja?", a: "Ya, layanan ambulans dan kondisi gawat darurat disiagakan 24 jam melalui kontak yang tercantum di bagian Lokasi & Kontak." },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section id="faq" className="py-16 sm:py-24" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center">
          <h2 className="mb-3" style={{ color: "var(--color-navy-900)" }}>FAQ — Pertanyaan yang Sering Diajukan</h2>
          <p className="mb-8" style={{ color: "var(--color-ink-500)" }}>Jawaban untuk pertanyaan umum seputar layanan Biddokkes.</p>
        </ScrollReveal>

        <div className="rounded-xl relative" style={{ border: "1px solid var(--color-line)", background: "var(--color-white)" }}>
          <div className="px-5">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="accordion-item">
                  <button
                    className="accordion-trigger"
                    onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <motion.span
                      className="accordion-icon"
                      animate={{ rotate: openIdx === i ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: "inline-block" }}
                    >+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIdx === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="text-sm leading-relaxed pb-4" style={{ color: "var(--color-ink-500)" }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
