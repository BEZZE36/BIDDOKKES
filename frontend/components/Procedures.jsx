"use client";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const PROCEDURES = [
  { title: "MCU & Surat Keterangan Sehat", steps: ["Datang & ambil nomor antrean di loket pendaftaran", "Registrasi & tunjukkan KTP/identitas asli", "Pemeriksaan fisik oleh dokter", "Ambil hasil surat keterangan sehat"], docs: "KTP/identitas asli, surat pengantar (jika untuk dinas)", note: "Gunakan kanal resmi. Hindari transfer ke pihak yang mengaku petugas untuk \"mempercepat layanan\"." },
  { title: "Vaksinasi", steps: ["Datang sesuai jadwal yang diumumkan", "Registrasi & tunjukkan identitas", "Skrining kesehatan singkat", "Vaksinasi oleh tenaga medis", "Observasi 15–30 menit"], docs: "Identitas diri, kartu vaksinasi sebelumnya (jika ada)", note: "Jadwal vaksinasi diumumkan di bagian Berita." },
  { title: "Laboratorium & Uji Narkoba", steps: ["Datang & registrasi di loket laboratorium", "Tunjukkan identitas & surat pengantar", "Pengambilan sampel oleh petugas", "Tunggu hasil (1–3 hari kerja)"], docs: "Identitas diri, surat pengantar (untuk uji narkoba dinas)", note: "Hasil resmi diterbitkan sesuai ketersediaan jenis pemeriksaan." },
  { title: "Psikologi", steps: ["Hubungi & daftarkan jadwal konseling/skrining", "Datang sesuai jadwal", "Sesi skrining/konseling dengan psikolog", "Hasil/rujukan disampaikan sesuai kebutuhan"], docs: "Identitas diri, surat pengantar (untuk dinas/seleksi)", note: "Jadwal menyesuaikan ketersediaan psikolog." },
  { title: "Ambulans & Rujukan", steps: ["Hubungi kontak siaga 24 jam (tercantum di bagian Lokasi)", "Tim medis akan merespons dan menentukan tindakan", "Transportasi ke fasilitas kesehatan jika diperlukan"], docs: "Tidak perlu dokumen — langsung hubungi kontak darurat", note: "Layanan siaga 24 jam." },
  { title: "Medikolegal (Visum et Repertum)", steps: ["Penyidik mengajukan surat permintaan visum resmi", "Berkas diterima & diverifikasi", "Pemeriksaan medikolegal dilakukan", "VER diterbitkan sesuai prosedur"], docs: "Surat permintaan visum resmi dari penyidik, berkas perkara", note: "Permohonan hanya melalui penyidik, bukan perseorangan." },
  { title: "DVI — Identifikasi Korban Bencana", steps: ["Koordinasi resmi lintas instansi dimulai", "Tim DVI dikerahkan ke lokasi", "Proses identifikasi sesuai standar Interpol/DVI", "Hasil identifikasi disampaikan ke instansi terkait"], docs: "Koordinasi resmi lintas instansi", note: "Menyesuaikan skala kejadian & kebutuhan." },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={onToggle}>
        <span>{item.title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: "inline-block" }}
          className="accordion-icon"
        >+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="space-y-3 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--color-teal-600)" }}>Langkah-langkah</p>
                <ol className="space-y-1.5">
                  {item.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-ink-500)" }}>
                      <span className="font-bold text-xs mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--color-teal-100)", color: "var(--color-teal-600)", fontFamily: "var(--font-mono)" }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-navy-900)" }}>Dokumen yang perlu dibawa</p>
                <p className="text-sm" style={{ color: "var(--color-ink-500)" }}>{item.docs}</p>
              </div>
              <div className="rounded-lg p-3 text-sm" style={{ background: "var(--color-mist)", color: "var(--color-ink-500)" }}>
                ⚠️ {item.note}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Procedures() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section id="prosedur" className="py-16 sm:py-24" style={{ background: "var(--color-white)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: "var(--color-teal-600)", fontFamily: "var(--font-mono)" }}>
            Panduan Pengunjung
          </p>
          <h2 className="mb-3" style={{ color: "var(--color-navy-900)" }}>Prosedur &amp; Syarat</h2>
          <p className="mb-8" style={{ color: "var(--color-ink-500)" }}>
            Klik layanan di bawah untuk melihat langkah-langkah dan dokumen yang perlu disiapkan.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-line)" }}>
            <div className="px-5">
              {PROCEDURES.map((item, i) => (
                <AccordionItem key={i} item={item} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
