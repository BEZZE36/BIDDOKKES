"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pathname = usePathname();
  const videoRef = useRef(null);

  // ── Timer: dismiss splash after video ends or after max timeout ──────
  useEffect(() => {
    if (pathname !== "/") {
      setShowSplash(false);
      return;
    }

    // Only show splash screen once per session/hard refresh
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    // Mark as seen so it doesn't show again on navigation
    sessionStorage.setItem("hasSeenSplash", "true");

    // The generated video is 4 seconds.
    // Start fading out at 4.2 seconds.
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // Completely remove component from DOM at 5 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  // ── Video play logic — runs once after component mounts ──────────────
  // Does NOT use a short safety timer. Instead relies on onError (JSX).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showSplash) return;

    // Try to play as soon as the browser has enough data
    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay policy blocked — still show black screen with timers,
        // which is better than no splash at all.
        // The main timers (4200ms / 5000ms) will still dismiss it.
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

  const dismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => setShowSplash(false), 700);
  };

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
