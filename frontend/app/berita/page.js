/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import BlurFade from "../../components/animations/BlurFade";
import TiltedCard from "../../components/animations/TiltedCard";
import { supabase } from "../../lib/supabaseClient";
import { NEWS_DATA } from "../../data/newsData";

function formatDate(str) {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return str;
  }
}

export default function BeritaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      if (!supabase) {
        setItems(NEWS_DATA);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("berita")
        .select("*")
        .eq("status", "publish")
        .order("created_at", { ascending: false });
      setItems(data?.length > 0 ? data : NEWS_DATA);
      setLoading(false);
    }
    fetchAll();

    if (!supabase) return;

    // Real-time subscription for live updates without refresh
    const channel = supabase
      .channel("public:berita:news_page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "berita" },
        () => {
          fetchAll(); // re-fetch when there's any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <title>Berita — Biddokkes Polda Sulteng</title>
      <Header />

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(10px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-line)",
              animation: "modal-pop 0.35s cubic-bezier(0.16,1,0.3,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selected.gambar_url && (
              <div
                className="w-full rounded-t-2xl overflow-hidden"
                style={{
                  background: "#0B1628",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "280px",
                  maxHeight: "420px",
                }}
              >
                <img
                  src={selected.gambar_url}
                  alt={selected.judul}
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <p
                className="text-xs mb-2 font-mono"
                style={{ color: "var(--color-ink-500)" }}
              >
                {formatDate(selected.created_at)}
              </p>
              <h2
                className="text-2xl font-black mb-4"
                style={{
                  color: "var(--color-navy-900)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {selected.judul}
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--color-ink-500)" }}
              >
                {selected.isi}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 px-6 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: "#0B2340", color: "white" }}
              >
                ✕ Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className="min-h-screen pt-20"
        style={{ background: "var(--color-paper)" }}
      >
        {/* ── Page Hero — full width, starts right below fixed navbar ── */}
        <BlurFade direction="down" duration={700}>
          <div
            className="py-20 sm:py-28 text-center relative overflow-hidden"
            style={{ background: "#0B2340" }}
          >
            {/* subtle radial glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 120%, rgba(217,164,65,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <p
              className="text-xs tracking-[0.18em] uppercase font-semibold mb-3 relative"
              style={{ color: "#D9A441", fontFamily: "var(--font-mono)" }}
            >
              Informasi Terbaru
            </p>
            <h1
              className="text-4xl sm:text-6xl font-black mb-4 relative"
              style={{ color: "#FFFFFF", fontFamily: "var(--font-display)" }}
            >
              Berita &amp; Pengumuman
            </h1>
            <p
              className="text-base max-w-xl mx-auto px-4 relative"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Informasi terkini seputar kegiatan dan layanan Biddokkes Polda
              Sulawesi Tengah
            </p>
          </div>
        </BlurFade>

        {/* ── Articles Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          {loading ? (
            <div className="text-center py-32">
              <div
                className="inline-block w-12 h-12 border-4 rounded-full animate-spin"
                style={{
                  borderColor: "var(--color-line)",
                  borderTopColor: "var(--color-teal-600)",
                }}
              />
              <p
                className="mt-4 text-sm"
                style={{ color: "var(--color-ink-500)" }}
              >
                Memuat berita...
              </p>
            </div>
          ) : items.length === 0 ? (
            <BlurFade>
              <div className="text-center py-32">
                <p className="text-5xl mb-4">📰</p>
                <p
                  className="font-semibold text-lg"
                  style={{ color: "var(--color-navy-900)" }}
                >
                  Belum ada berita yang diterbitkan
                </p>
              </div>
            </BlurFade>
          ) : (
            <>
              <BlurFade delay={50}>
                <p
                  className="text-sm mb-8"
                  style={{ color: "var(--color-ink-500)" }}
                >
                  <strong>{items.length}</strong> berita tersedia
                </p>
              </BlurFade>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <BlurFade
                    key={item.id}
                    delay={i * 80}
                    direction="up"
                    duration={650}
                  >
                    <TiltedCard
                      tiltAmount={5}
                      style={{ height: "100%" }}
                    >
                      <button
                        onClick={() => setSelected(item)}
                        className="w-full text-left rounded-2xl overflow-hidden shadow-md group"
                        style={{
                          background: "var(--color-white)",
                          border: "1px solid var(--color-line)",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          transition: "box-shadow 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 12px 40px rgba(14,140,130,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        {/* Image / Placeholder */}
                        <div
                          className="relative overflow-hidden"
                          style={{ flexShrink: 0 }}
                        >
                          {item.gambar_url ? (
                            <>
                              <div
                                style={{
                                  background: "#0B1628",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "220px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={item.gambar_url}
                                  alt={item.judul}
                                  loading="lazy"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "220px",
                                    objectFit: "contain",
                                    display: "block",
                                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                  }}
                                />
                              </div>
                              {/* gradient overlay */}
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background:
                                    "linear-gradient(to bottom, transparent 60%, rgba(11,35,64,0.5) 100%)",
                                  pointerEvents: "none",
                                }}
                              />
                            </>
                          ) : (
                            <div
                              className="w-full h-48 flex items-center justify-center text-5xl"
                              style={{ background: "var(--color-mist)" }}
                            >
                              📰
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className="p-5 flex flex-col gap-2"
                          style={{ flex: 1 }}
                        >
                          <p
                            className="text-xs font-mono"
                            style={{ color: "var(--color-teal-600)" }}
                          >
                            {formatDate(item.created_at)}
                          </p>
                          <h3
                            className="font-bold text-base line-clamp-2 leading-snug"
                            style={{ color: "var(--color-navy-900)" }}
                          >
                            {item.judul}
                          </h3>
                          <p
                            className="text-sm line-clamp-3 leading-relaxed flex-1"
                            style={{ color: "var(--color-ink-500)" }}
                          >
                            {item.isi}
                          </p>
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
                            style={{
                              color: "var(--color-teal-600)",
                              transition: "gap 0.2s",
                            }}
                          >
                            Baca selengkapnya
                            <span style={{ transition: "transform 0.2s" }}>→</span>
                          </span>
                        </div>
                      </button>
                    </TiltedCard>
                  </BlurFade>
                ))}
              </div>
            </>
          )}

          {/* ── Back to Homepage ── */}
          <BlurFade delay={200} direction="up">
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-80 hover:-translate-y-0.5"
                style={{
                  background: "#0B2340",
                  color: "white",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </BlurFade>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
