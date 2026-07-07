"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const pathname = usePathname();
  const videoRef = useRef(null);

  // ── Session Storage & Safety Timeout ──────
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setTimeout(() => setShowSplash(false), 0);
      return;
    }
    sessionStorage.setItem("hasSeenSplash", "true");

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();

    const safetyTimer = setTimeout(() => {
      dismiss();
    }, isMobile ? 2500 : 8000);

    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [pathname, isMobile]);

  // ── Video play logic ──────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showSplash || isMobile) return;

    const tryPlay = () => {
      video.play().catch(() => {
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
  }, [showSplash, isMobile]);

  function dismiss() {
    setIsFadingOut(true);
    setTimeout(() => setShowSplash(false), 700);
  }

  if (pathname !== "/") return null;
  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full h-full">
        {!isMobile && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/media/hero/1783055225673.jpg"
            onEnded={dismiss}
            onError={dismiss}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/0705.mp4" type="video/mp4" />
          </video>
        )}

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <div className={`w-full h-full flex flex-col items-center justify-center animate-pulse ${!isMobile ? 'hidden' : ''}`}>
            <div className="relative w-32 h-32 mb-4">
              <Image 
                src="/logo.png" 
                alt="Logo Biddokkes" 
                fill
                sizes="128px"
                priority={true}
                className="object-contain" 
              />
            </div>
            <p className="text-white text-xl font-bold tracking-widest font-mono drop-shadow-lg">BIDDOKKES</p>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-40 h-20 bg-black z-20"></div>
        <div className="absolute top-0 right-0 w-40 h-20 bg-black z-20"></div>
      </div>
    </div>
  );
}
