"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setShowSplash(false);
      return;
    }

    // Only show splash screen once per session/hard refresh
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      // eslint-disable-next-line
      setShowSplash(false);
      return;
    }

    // Mark as seen so it doesn't show again on navigation
    sessionStorage.setItem("hasSeenSplash", "true");

    // The generated video is 4 seconds. 
    // Start fading out at 4.2 seconds.
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // Completely remove component from DOM at 5 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  // If user navigates or has already seen it, don't render anything
  if (pathname !== "/") return null;
  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <video
          autoPlay
          muted
          playsInline
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
