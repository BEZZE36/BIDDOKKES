"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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

    // Jika setelah 8 detik video macet/lambat (12MB), tutup paksa saja
    const safetyTimer = setTimeout(() => {
      dismiss();
    }, 8000);

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
          preload="auto"
          onEnded={dismiss}
          onError={dismiss}
          className="w-full h-full object-contain"
        >
          <source src="/0705.mp4" type="video/mp4" />
        </video>
        {/* Penutup Watermark Gemini di Pojok Kanan Bawah */}
        <div className="absolute bottom-0 right-0 w-40 h-20 bg-black z-10"></div>
        <div className="absolute top-0 right-0 w-40 h-20 bg-black z-10"></div>
      </div>
    </div>
  );
}
