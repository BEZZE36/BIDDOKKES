/* eslint-disable @next/next/no-img-element */
// Hero — Ref-based slide controller: zero React re-renders during transitions.
// All slide switching is done via direct DOM style manipulation,
// so the SignageStrip below (CSS animation) is never interrupted.
"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    judul: "BIDDOKKES POLDA SULTENG",
    subtitle:
      "Bidang Kedokteran dan Kesehatan Kepolisian Daerah Sulawesi Tengah",
  },
  {
    id: "fallback-2",
    image_url:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    judul: "PELAYANAN PRIMA",
    subtitle:
      "Mengutamakan pengabdian kepada masyarakat dalam setiap layanan kesehatan",
  },
  {
    id: "fallback-3",
    image_url:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    judul: "KESAMAPTAAN PERSONEL",
    subtitle:
      "Mendukung tugas pokok dan fungsi Polri melalui kesehatan yang optimal",
  },
];

export default function Hero() {
  // slides only set once on mount (from Supabase); after that, never changes
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  // ── refs: track active slide without causing re-renders ──────────────
  const currentRef   = useRef(0);          // active slide index
  const slideEls     = useRef([]);         // array of slide wrapper DOM nodes
  const dotEls       = useRef([]);         // array of dot button DOM nodes
  const titleEl      = useRef(null);       // h1
  const subtitleEl   = useRef(null);       // p
  const timerRef     = useRef(null);
  // keep latest slides accessible inside the interval without re-creating it
  const slidesRef    = useRef(slides);

  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // Fetch slides once
  useEffect(() => {
    async function fetchSlides() {
      if (!supabase) return;
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .order("urutan", { ascending: true });
      if (data && data.length > 0) setSlides(data);
    }
    fetchSlides();
  }, []);

  // ── Core transition — direct DOM, zero React setState ─────────────────
  function goTo(nextIdx) {
    const all = slidesRef.current;
    const prev = currentRef.current;
    if (nextIdx === prev) return;

    // Crossfade images
    if (slideEls.current[prev]) {
      slideEls.current[prev].style.opacity = "0";
      slideEls.current[prev].style.zIndex  = "5";
    }
    if (slideEls.current[nextIdx]) {
      slideEls.current[nextIdx].style.opacity = "1";
      slideEls.current[nextIdx].style.zIndex  = "10";
    }

    // Update dots
    if (dotEls.current[prev]) {
      dotEls.current[prev].style.background = "rgba(255,255,255,0.5)";
      dotEls.current[prev].style.transform  = "scale(1)";
      dotEls.current[prev].style.boxShadow  = "none";
    }
    if (dotEls.current[nextIdx]) {
      dotEls.current[nextIdx].style.background = "#fff";
      dotEls.current[nextIdx].style.transform  = "scale(1.25)";
      dotEls.current[nextIdx].style.boxShadow  = "0 0 8px rgba(255,255,255,0.8)";
    }

    // Animate text: fade out → swap content → fade in
    const slide = all[nextIdx];
    if (titleEl.current && subtitleEl.current) {
      titleEl.current.style.opacity   = "0";
      titleEl.current.style.transform = "translateY(12px)";
      subtitleEl.current.style.opacity   = "0";
      subtitleEl.current.style.transform = "translateY(12px)";
      setTimeout(() => {
        if (titleEl.current)    titleEl.current.textContent    = slide?.judul    ?? "";
        if (subtitleEl.current) subtitleEl.current.textContent = slide?.subtitle ?? "";
        if (titleEl.current) {
          titleEl.current.style.color   = slide?.warna_teks || "#FFFFFF";
          titleEl.current.style.opacity = "1";
          titleEl.current.style.transform = "translateY(0)";
        }
        if (subtitleEl.current) {
          subtitleEl.current.style.color   = slide?.warna_teks || "#E5E7EB";
          subtitleEl.current.style.opacity = "1";
          subtitleEl.current.style.transform = "translateY(0)";
        }
      }, 300);
    }

    currentRef.current = nextIdx;
  }

  // Auto-slide timer — created once, never re-created
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % slidesRef.current.length;
      goTo(next);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Initial slide
  const firstSlide = slides[0];

  return (
    <section
      id="hero"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          clearInterval(timerRef.current);
          const next = (currentRef.current - 1 + slidesRef.current.length) % slidesRef.current.length;
          goTo(next);
          timerRef.current = setInterval(() => { goTo((currentRef.current + 1) % slidesRef.current.length); }, 5000);
        } else if (e.key === "ArrowRight") {
          clearInterval(timerRef.current);
          const next = (currentRef.current + 1) % slidesRef.current.length;
          goTo(next);
          timerRef.current = setInterval(() => { goTo((currentRef.current + 1) % slidesRef.current.length); }, 5000);
        }
      }}
      className="relative w-full overflow-hidden flex items-center justify-center bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
      style={{ height: "100vh", paddingTop: "64px", boxSizing: "border-box" }}
    >
      {/* Slide layers — rendered once from state, controlled via refs after */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => { slideEls.current[index] = el; }}
          aria-hidden={index !== 0}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: index === 0 ? 1 : 0,
            zIndex: index === 0 ? 10 : 5,
            transition: "opacity 1.2s ease-in-out",
            willChange: "opacity",
            pointerEvents: "none",
          }}
        >
          {/* Blurred background fill */}
          <img
            src={slide.image_url}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(40px)",
              opacity: 0.6,
              transform: "scale(1.1)",
              zIndex: 0,
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1,
            }}
          />
          {/* Main image */}
          <img
            src={slide.image_url}
            alt={slide.judul}
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 25px 25px rgb(0,0,0,0.5))",
            }}
          />
        </div>
      ))}

      {/* Text content — ref-controlled, never causes re-render */}
      <div
        className="relative max-w-5xl mx-auto px-6 py-16 text-center space-y-6 rounded-3xl"
        style={{ zIndex: 20, pointerEvents: "none", background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 75%)" }}
      >
        <div>
          <h1
            ref={titleEl}
            className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 drop-shadow-xl"
            style={{
              fontFamily: "var(--font-display)",
              color: firstSlide?.warna_teks || "#FFFFFF",
              transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
              willChange: "opacity, transform",
            }}
          >
            {firstSlide?.judul}
          </h1>
          <p
            ref={subtitleEl}
            className="text-lg sm:text-2xl drop-shadow-md font-medium max-w-3xl mx-auto leading-relaxed"
            style={{
              color: firstSlide?.warna_teks || "#E5E7EB",
              transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
              willChange: "opacity, transform",
            }}
          >
            {firstSlide?.subtitle}
          </p>
        </div>
      </div>

      {/* Dots — ref-controlled */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              clearInterval(timerRef.current);
              goTo(index);
              // Restart auto-slide after manual nav
              timerRef.current = setInterval(() => {
                const next = (currentRef.current + 1) % slidesRef.current.length;
                goTo(next);
              }, 5000);
            }}
            className="p-3 cursor-pointer bg-transparent border-none"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              ref={(el) => { dotEls.current[index] = el; }}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
                background: index === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                transform: index === 0 ? "scale(1.25)" : "scale(1)",
                boxShadow: index === 0 ? "0 0 8px rgba(255,255,255,0.8)" : "none",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
