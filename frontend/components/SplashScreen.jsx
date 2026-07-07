"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pathname = usePathname();
  const videoRef = useRef(null);

  // ── Session Storage & Safety Timeout ──────
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    // Kembalikan batasan: Hanya muncul 1 kali per sesi (sesuai permintaan)
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setTimeout(() => setShowSplash(false), 0);
      return;
    }
    sessionStorage.setItem("hasSeenSplash", "true");

    // Jika setelah batas waktu video macet/lambat, tutup paksa saja
    // Pada mobile, waktu tunggu lebih singkat dan menggunakan gambar statis
    const isMobile = window.innerWidth < 640;
    const safetyTimer = setTimeout(() => {
      dismiss();
    }, isMobile ? 2500 : 8000);

    return () => clearTimeout(safetyTimer);
  }, [pathname]);

  // ── Video play logic ──────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showSplash) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay diblokir browser (misal mode hemat daya/Safari)
        // Langsung tutup splash screen daripada layar hitam
        dismiss();
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, [showSplash]);

  function dismiss() {
    setIsFadingOut(true);
    setTimeout(() => setShowSplash(false), 700);
  }

  // If user navigates or has already seen it, don't render anything
  if (pathname !== "/") return null;
  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="https://storage.pusdokkes.polri.go.id/pusdokkes/logo.png"
          onEnded={dismiss}
          onError={dismiss}
          className="hidden sm:block w-full h-full object-contain"
        >
          <source src="/0705.mp4" type="video/mp4" media="(min-width: 640px)" />
        </video>
        {/* Gambar statis untuk mobile (lebih ringan & cepat) */}
        <div className="sm:hidden w-full h-full flex flex-col items-center justify-center animate-pulse">
          <div className="relative w-32 h-32 mb-4">
            <Image 
              src="https://storage.pusdokkes.polri.go.id/pusdokkes/logo.png" 
              alt="Logo Biddokkes" 
              fill
              sizes="128px"
              priority={true}
              className="object-contain" 
            />
          </div>
          <p className="text-white text-xl font-bold tracking-widest font-mono">BIDDOKKES</p>
        </div>
        {/* Penutup Watermark Gemini di Pojok Kanan Bawah */}
        <div className="absolute bottom-0 right-0 w-40 h-20 bg-black z-10"></div>
        <div className="absolute top-0 right-0 w-40 h-20 bg-black z-10"></div>
      </div>
    </div>
  );
}
