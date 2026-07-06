import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./animations/SpotlightCard";

const SERVICES = [
  { title: "MCU & Surat Keterangan Sehat", desc: "Pemeriksaan kesehatan umum untuk keperluan kerja, SIM, pendaftaran Polri/pendidikan, serta pemeriksaan berkala personel.", syarat: "KTP/identitas asli, surat pengantar (jika untuk keperluan dinas)", waktu: "30–60 menit", color: "teal", icon: "🩺" },
  { title: "Vaksinasi", desc: "Program imunisasi periodik untuk personel Polri, keluarga, dan mendukung program kesehatan masyarakat.", syarat: "Identitas diri, kartu vaksinasi sebelumnya (jika ada)", waktu: "15–30 menit", color: "gold", icon: "💉" },
  { title: "Laboratorium & Uji Narkoba", desc: "Pemeriksaan penunjang standar (hematologi, kimia klinik) serta skrining NAPZA untuk keperluan dinas maupun umum.", syarat: "Identitas diri, surat pengantar (untuk uji narkoba dinas)", waktu: "Hasil 1–3 hari kerja", color: "navy", icon: "🔬" },
  { title: "Psikologi", desc: "Skrining psikologi, konseling, dan rujukan layanan lanjutan bagi personel dan keluarga yang membutuhkan.", syarat: "Identitas diri, surat pengantar (untuk keperluan dinas/seleksi)", waktu: "Menyesuaikan jadwal psikolog", color: "teal", icon: "🧠" },
  { title: "Ambulans & Rujukan", desc: "Dukungan transportasi medis dan koordinasi rujukan ke rumah sakit bila diperlukan penanganan lanjutan.", syarat: "Kondisi darurat langsung hubungi kontak siaga 24 jam", waktu: "Respons segera", color: "gold", icon: "🚑" },
  { title: "Medikolegal (Visum et Repertum)", desc: "Penerbitan VER untuk kepentingan penyidikan, diajukan melalui penyidik sesuai prosedur medikolegal.", syarat: "Surat permintaan visum resmi dari penyidik", waktu: "Sesuai prosedur & jenis kasus", color: "navy", icon: "⚖️" },
  { title: "DVI — Identifikasi Korban Bencana", desc: "Dukungan identifikasi korban bencana dan penanganan khusus dalam situasi darurat/bencana massal.", syarat: "Koordinasi resmi lintas instansi terkait", waktu: "Menyesuaikan skala kejadian", color: "teal", icon: "🆘" },
];

const COLOR_MAP = {
  teal: { bg: "var(--color-teal-100)", accent: "var(--color-teal-700)", spotlight: "rgba(14,140,130,0.12)" },
  gold: { bg: "#FFF7E6", accent: "var(--color-gold-500)", spotlight: "rgba(217,164,65,0.12)" },
  navy: { bg: "#E8EDF4", accent: "var(--color-navy-900)", spotlight: "rgba(10,31,68,0.08)" },
};

export default function Services() {
  return (
    <section id="layanan" className="py-16 sm:py-24" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="mb-3" style={{ color: "var(--color-navy-900)" }}>Program Utama Layanan Biddokkes</h2>
          <p className="mb-10 max-w-2xl" style={{ color: "var(--color-ink-500)" }}>
            7 jenis layanan kesehatan kepolisian yang tersedia untuk personel Polri, keluarga, dan masyarakat umum.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const c = COLOR_MAP[s.color];
            return (
              <ScrollReveal key={i} delay={i * 80}>
                <SpotlightCard
                  className="service-card h-full flex flex-col"
                  style={{ "--card-bg": "var(--color-white)" }}
                  spotlightColor={c.spotlight}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="service-icon w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ background: c.bg }}
                    >
                      {s.icon}
                    </div>
                    <h3 className="text-base font-bold leading-snug" style={{ color: "var(--color-navy-900)" }}>
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm mb-4 flex-1" style={{ color: "var(--color-ink-500)" }}>{s.desc}</p>
                  <div className="space-y-1 text-xs" style={{ color: "var(--color-ink-500)" }}>
                    <p><span className="font-semibold" style={{ color: "var(--color-navy-900)" }}>Syarat:</span> {s.syarat}</p>
                    <p><span className="font-semibold" style={{ color: "var(--color-navy-900)" }}>Estimasi:</span> {s.waktu}</p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
