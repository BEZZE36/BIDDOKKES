/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./animations/SpotlightCard";
import { NEWS_DATA } from "../data/newsData";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      if (!supabase) { 
        setItems(NEWS_DATA);
        setLoading(false); 
        return; 
      }
      const { data } = await supabase
        .from("berita")
        .select("*")
        .eq("status", "publish")
        .order("created_at", { ascending: false })
        .limit(3);
      
      setItems(data?.length > 0 ? data : NEWS_DATA);
      setLoading(false);
    }
    fetchNews();

    if (!supabase) return;

    // Real-time subscription for live updates without refresh
    const channel = supabase
      .channel("public:berita:news_widget")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "berita" },
        () => {
          fetchNews(); // re-fetch when there's any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="berita" className="py-16 sm:py-24" style={{ background: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <h2 style={{ color: "var(--color-navy-900)", margin: 0 }}>Berita &amp; Pengumuman</h2>
            <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: "rgba(11, 35, 64, 0.08)", color: "var(--color-navy-900)", fontFamily: "var(--font-mono)" }}>
              Informasi Terbaru
            </span>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-line)", borderTopColor: "var(--color-teal-600)" }} />
          </div>
        ) : items.length === 0 ? (
          <ScrollReveal>
            <div id="berita-empty" className="text-center py-16 rounded-xl" style={{ background: "var(--color-mist)" }}>
              <p className="text-4xl mb-3">📰</p>
              <p className="font-semibold mb-1" style={{ color: "var(--color-navy-900)" }}>Belum ada berita</p>
              <p className="text-sm" style={{ color: "var(--color-ink-500)" }}>Pantau terus halaman ini untuk informasi kegiatan dan layanan terbaru.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 60}>
                <SpotlightCard
                  className="service-card h-full flex flex-col"
                  style={{ "--card-bg": "var(--color-white)" }}
                  spotlightColor="rgba(14,140,130,0.10)"
                >
                  {item.gambar_url && (
                    <div className="relative w-full h-40 mb-3">
                      <Image 
                        src={item.gambar_url} 
                        alt={item.judul} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-lg" 
                        loading="lazy" 
                      />
                    </div>
                  )}
                  <p className="text-xs mb-2" style={{ color: "var(--color-ink-500)", fontFamily: "var(--font-mono)" }}>
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-navy-900)" }}>{item.judul}</h3>
                  <p className="text-sm flex-1" style={{ color: "var(--color-ink-500)" }}>
                    {item.isi.length > 250 ? item.isi.substring(0, 250) + "..." : item.isi}
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <ScrollReveal delay={300}>
            <Link
              href="/berita"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#0B2340", color: "white" }}
            >
              Lihat Semua Berita →
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
