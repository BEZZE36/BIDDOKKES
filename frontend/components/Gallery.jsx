/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import Lightbox from "./animations/Lightbox";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { GALLERY_DATA } from "../data/galleryData";

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ src: null, alt: "" });
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchGallery() {
      if (!supabase) {
        setItems(GALLERY_DATA.map((d) => ({ id: d.id, media_url: d.url, judul: d.alt, tipe_media: "gambar" })));
        return;
      }
      const { data } = await supabase
        .from("galeri")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems(GALLERY_DATA.map((d) => ({ id: d.id, media_url: d.url, judul: d.alt, tipe_media: "gambar" })));
      }
    }
    fetchGallery();
  }, []);

  return (
    <>
      <Lightbox
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={() => setLightbox({ src: null, alt: "" })}
      />

      <section id="galeri" className="py-16 sm:py-24" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="mb-4 text-3xl sm:text-5xl font-black" style={{ color: "var(--color-navy-900)", fontFamily: "var(--font-display)" }}>
              Dokumentasi Kegiatan
            </h2>
            <div className="w-16 h-1 mx-auto rounded-full mb-6" style={{ background: "var(--color-line)" }} />
            <p className="text-base sm:text-lg" style={{ color: "var(--color-ink-500)" }}>
              Lihat berbagai kegiatan dan aktivitas Biddokkes POLRI
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 50}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl bg-white dark:bg-[#1A2332]"
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
                      <img
                        src={item.media_url}
                        alt={item.judul}
                        className="w-full aspect-4/3 object-cover"
                        loading="lazy"
                      />
                  )}
                  {(item.judul || item.deskripsi) && (
                    <div className="p-4 bg-white dark:bg-[#1A2332]">
                      {item.judul && (
                        <h3 className="font-bold text-base truncate mb-1" style={{ color: "var(--color-navy-900)" }}>
                          {item.judul}
                        </h3>
                      )}
                      {item.deskripsi && (
                        <p className="text-sm line-clamp-2" style={{ color: "var(--color-ink-500)" }}>
                          {item.deskripsi}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ScrollReveal delay={300}>
              <Link
                href="/galeri"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "var(--color-teal-600)", color: "white" }}
              >
                Lihat Semua Galeri →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
