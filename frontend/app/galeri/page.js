/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Lightbox from "../../components/animations/Lightbox";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { GALLERY_DATA } from "../../data/galleryData";

export default function GaleriPage() {
  const [lightbox, setLightbox] = useState({ src: null, alt: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    async function fetchAll() {
      if (!supabase) {
        setItems(GALLERY_DATA.map((d) => ({ id: d.id, media_url: d.url, judul: d.alt, tipe_media: "gambar" })));
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("galeri")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems(GALLERY_DATA.map((d) => ({ id: d.id, media_url: d.url, judul: d.alt, tipe_media: "gambar" })));
      }
      setLoading(false);
    }
    fetchAll();
  }, []);

  const filtered = filter === "semua" ? items : items.filter((i) => i.tipe_media === filter);

  return (
    <>
      <title>Galeri — Biddokkes Polda Sulteng</title>
      <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox({ src: null, alt: "" })} />
      <Header />

      <main className="min-h-screen pt-20" style={{ background: "var(--color-paper)" }}>

        {/* ── Page Hero — hardcoded dark navy (tidak terpengaruh dark mode toggle) ── */}
        <div
          className="py-16 sm:py-20 text-center"
          style={{ background: "#0B2340" }}
        >
          <p className="text-xs tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: "#D9A441", fontFamily: "var(--font-mono)" }}>
            Dokumentasi
          </p>
          <h1 className="text-3xl sm:text-5xl font-black mb-3" style={{ color: "#FFFFFF", fontFamily: "var(--font-display)" }}>
            Galeri Kegiatan
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-base max-w-xl mx-auto px-4">
            Kumpulan dokumentasi foto dan video kegiatan Biddokkes Polda Sulawesi Tengah
          </p>

          {/* Filter Pills */}
          <div className="flex justify-center gap-3 mt-8">
            {[
              { key: "semua", label: "🗂 Semua" },
              { key: "gambar", label: "🖼 Foto" },
              { key: "video", label: "🎬 Video" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: filter === f.key ? "#D9A441" : "rgba(255,255,255,0.12)",
                  color: filter === f.key ? "#0B2340" : "white",
                  border: filter === f.key ? "none" : "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-line)", borderTopColor: "var(--color-teal-600)" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">🖼</p>
              <p className="font-semibold" style={{ color: "var(--color-navy-900)" }}>Belum ada item di kategori ini</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: "var(--color-ink-500)" }}>
                Menampilkan <strong>{filtered.length}</strong> item
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
                    style={{ background: "var(--color-white)", border: "1px solid var(--color-line)" }}
                    onClick={() => setLightbox({ src: item.media_url, alt: item.judul })}
                  >
                    {item.tipe_media === "video" ? (
                      <div className="relative">
                        <video src={item.media_url} className="w-full aspect-4/3 object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-3xl">▶️</span>
                        </div>
                      </div>
                    ) : (
                      <img src={item.media_url} alt={item.judul} className="w-full aspect-4/3 object-cover" loading="lazy" />
                    )}
                    {(item.judul || item.deskripsi) && (
                      <div className="px-4 py-3">
                        {item.judul && (
                          <p className="text-sm font-bold truncate mb-1" style={{ color: "var(--color-navy-900)" }}>{item.judul}</p>
                        )}
                        {item.deskripsi && (
                          <p className="text-xs line-clamp-2" style={{ color: "var(--color-ink-500)" }}>
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ── Back to Homepage button ── */}
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
