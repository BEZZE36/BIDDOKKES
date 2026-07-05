"use client";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { ABOUT_DATA } from "../data/aboutData";
import { supabase } from "../lib/supabaseClient";
import VisitorCounter from "./animations/VisitorCounter";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";


function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  const [profileImage, setProfileImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    async function fetchImage() {
      if (!supabase) return;
      const { data } = await supabase
        .from("about_image")
        .select("image_url")
        .order("updated_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) setProfileImage(data[0].image_url);
    }
    fetchImage();
  }, []);

  return (
    <section id="tentang" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: "var(--color-white)" }}>
      {/* Floating background blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, var(--color-navy-900), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <p className="text-xs tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: "var(--color-teal-600)", fontFamily: "var(--font-mono)" }}>Profil Instansi</p>
          <h2 className="mb-10 lg:mb-16" style={{ color: "var(--color-navy-900)" }}>
            Tentang Biddokkes Polda Sulteng
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={100}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group bg-white p-4">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profileImage} 
                  alt="Profil Biddokkes" 
                  className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Floating Tribrata Badge Decoration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-[#1A2332] p-4 rounded-xl shadow-xl border border-gray-100 dark:border-[rgba(255,255,255,0.1)] flex items-center gap-4"
              >
                <div className="w-12 h-14 relative shrink-0">
                  <div className="absolute inset-0 rounded-t-xl" style={{ background: "linear-gradient(180deg, var(--color-gold-500) 0%, var(--color-gold-600) 100%)", clipPath: "polygon(50% 100%, 0 25%, 0 0, 100% 0, 100% 25%)" }} />
                  <div className="absolute inset-1 rounded-t-lg flex items-center justify-center" style={{ background: "#0B2340", clipPath: "polygon(50% 100%, 0 25%, 0 0, 100% 0, 100% 25%)" }}>
                    <span className="text-xs" style={{ color: "var(--color-gold-500)" }}>★</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-500)" }}>TRIBRATA</p>
                  <p className="text-[10px] uppercase font-semibold opacity-70">Pengabdian</p>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right Column: Text */}
          <div className="lg:col-span-7 space-y-8 lg:pt-4">
            <ScrollReveal delay={150}>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-ink-500)" }}>
                {ABOUT_DATA.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--color-navy-900)" }}>Visi</h3>
              <p className="text-base leading-relaxed font-medium" style={{ color: "var(--color-ink-500)" }}>
                {ABOUT_DATA.visi}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "var(--color-navy-900)" }}>Misi</h3>
              <ul className="space-y-3">
                {ABOUT_DATA.misi.map((m, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 text-base"
                    style={{ color: "var(--color-ink-500)" }}
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-teal-600)" }} />
                    <span className="flex-1">{m}</span>
                  </motion.li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 mt-8" style={{ color: "var(--color-navy-900)" }}>Sasaran Strategis Biddokkes Polda Sulteng</h3>
              <p className="text-base mb-4" style={{ color: "var(--color-ink-500)" }}>
                Biddokkes Polda Sulteng memiliki Sasaran Strategis sebagai berikut:
              </p>
              <ul className="space-y-3">
                {ABOUT_DATA.sasaranStrategis.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 text-base"
                    style={{ color: "var(--color-ink-500)" }}
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-gold-500)" }} />
                    <span className="flex-1">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 sm:mt-24">
          {ABOUT_DATA.stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              id={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="rounded-xl p-5 text-center cursor-default"
              style={{ background: "var(--color-mist)" }}
            >
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-4xl font-bold mb-1" style={{ color: "var(--color-teal-600)", fontFamily: "var(--font-display)" }}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm font-medium mt-2" style={{ color: "var(--color-ink-500)" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Visitor Counter — full width row below stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #0B2340 0%, #14315A 100%)",
            border: "1px solid rgba(217,164,65,0.3)",
          }}
        >
          <div>
            <p
              className="text-xs tracking-[0.15em] uppercase font-semibold mb-1"
              style={{ color: "#D9A441", fontFamily: "var(--font-mono)" }}
            >
              🌐 Total Pengunjung Website
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Data kunjungan real-time — setiap kali halaman dibuka dihitung
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <VisitorCounter />
            <span
              className="text-sm font-semibold"
              style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-mono)" }}
            >
              kunjungan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
