"use client";
import { motion } from "framer-motion";
import ShinyText from "./animations/ShinyText";
import SpotlightCard from "./animations/SpotlightCard";

export default function AdminHome({ setTab, isDark }) {
  const cards = [
    { key: "galeri", title: "Kelola Galeri", icon: "📷", desc: "Unggah dan atur dokumentasi foto/video kegiatan." },
    { key: "berita", title: "Kelola Berita", icon: "📰", desc: "Tulis dan publikasikan informasi atau pengumuman terbaru." },
    { key: "pesan", title: "Inbox Pesan", icon: "✉️", desc: "Baca pesan dan pertanyaan dari masyarakat." },
    { key: "hero", title: "Slider Beranda", icon: "🖼️", desc: "Ganti gambar besar dan teks sambutan utama di halaman depan." },
    { key: "about", title: "Profil Singkat", icon: "👤", desc: "Perbarui foto dan informasi singkat Biddokkes." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto py-10"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--adm-text)" }}>
          <ShinyText text="Selamat Datang di Admin Panel" disabled={false} speed={3} className="inline-block" />
        </h1>
        <p className="text-lg opacity-80" style={{ color: "var(--adm-text-muted)" }}>
          Pusat kendali konten website Biddokkes Polda Sulawesi Tengah.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="h-full"
            onClick={() => setTab(card.key)}
          >
            <SpotlightCard 
              className="h-full cursor-pointer transition-transform hover:-translate-y-2 flex flex-col items-center text-center p-8 rounded-2xl shadow-sm border"
              style={{
                "--card-bg": isDark ? "var(--adm-surface)" : "#FFFFFF",
                borderColor: "var(--adm-border)"
              }}
              spotlightColor={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(14, 140, 130, 0.12)"}
            >
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--adm-text)" }}>{card.title}</h3>
              <p className="text-sm opacity-80" style={{ color: "var(--adm-text-muted)" }}>{card.desc}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
