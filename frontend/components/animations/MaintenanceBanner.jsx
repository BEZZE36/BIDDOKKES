"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MaintenanceBanner({ data, target }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Blokir zoom dan matikan scroll latar belakang secara absolut
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        overflow: hidden !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        touch-action: none !important;
      }
      /* Sembunyikan scrollbar sepenuhnya */
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "0")) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    const targetWaktuSelesai =
      target === "admin"
        ? data?.waktu_selesai_admin
        : data?.waktu_selesai_public;
    if (!targetWaktuSelesai) return;

    const targetTime = new Date(targetWaktuSelesai).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsExpired(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data?.waktu_selesai_public, data?.waktu_selesai_admin, target]);

  if (!mounted) return null;

  const startDate = data?.waktu_mulai
    ? new Date(data.waktu_mulai).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const targetWaktuSelesaiForDate =
    target === "admin" ? data?.waktu_selesai_admin : data?.waktu_selesai_public;
  const endDate = targetWaktuSelesaiForDate
    ? new Date(targetWaktuSelesaiForDate).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center overflow-hidden"
      style={{ background: "#050A0F", color: "#F1F5F9" }}
    >
      {/* Top Police Line */}
      <div
        className="absolute top-1/2 left-[-50vw] w-[200vw] -translate-y-1/2 rotate-25 overflow-hidden text-black font-black text-sm tracking-[0.3em] border-y-4 border-black z-100 flex shadow-[0_0_20px_rgba(250,204,21,0.4)] h-10 pointer-events-none opacity-80"
        style={{
          fontFamily: "var(--font-mono)",
          backgroundColor: "#facc15",
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 15px, #000000 15px, #000000 30px)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)",
          maskImage:
            "linear-gradient(90deg, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)",
        }}
      >
        <motion.div
          /* LOGIKA ANIMASI PITA: bergerak dari 0% ke -50% secara berulang tanpa putus */
          animate={{ x: ["0%", "-50%"] }}
          /* ATUR KECEPATAN ANIMASI DI SINI: Ubah nilai 'duration' (dalam detik) */
          transition={{ ease: "linear", duration: 100, repeat: Infinity }}
          className="flex whitespace-nowrap h-full items-stretch"
        >
          {Array(40)
            .fill("POLICE LINE DO NOT CROSS - RESTRICTED AREA")
            .map((text, i) => (
              <div key={i} className="flex items-stretch">
                <span className="flex items-center bg-yellow-400 px-6 font-black text-black">
                  {text}
                </span>
                <div
                  className="w-16"
                  style={{ background: "transparent" }}
                ></div>
              </div>
            ))}
        </motion.div>
      </div>

      {/* Bottom Police Line */}
      <div
        className="absolute top-1/2 left-[-50vw] w-[200vw] -translate-y-1/2 -rotate-25 overflow-hidden text-black font-black text-sm tracking-[0.3em] border-y-4 border-black z-100 flex shadow-[0_0_20px_rgba(250,204,21,0.4)] h-10 pointer-events-none opacity-80"
        style={{
          fontFamily: "var(--font-mono)",
          backgroundColor: "#facc15",
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 15px, #000000 15px, #000000 30px)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)",
          maskImage:
            "linear-gradient(90deg, black 0%, black 35%, transparent 45%, transparent 55%, black 65%, black 100%)",
        }}
      >
        <motion.div
          /* LOGIKA ANIMASI PITA: bergerak dari -50% ke 0% secara berulang tanpa putus */
          animate={{ x: ["-50%", "0%"] }}
          /* ATUR KECEPATAN ANIMASI DI SINI: Ubah nilai 'duration' (dalam detik) */
          transition={{ ease: "linear", duration: 100, repeat: Infinity }}
          className="flex whitespace-nowrap h-full items-stretch"
        >
          {Array(40)
            .fill("POLICE LINE DO NOT CROSS - SYSTEM LOCKDOWN")
            .map((text, i) => (
              <div key={i} className="flex items-stretch">
                <span className="flex items-center bg-yellow-400 px-6 font-black text-black">
                  {text}
                </span>
                <div
                  className="w-16"
                  style={{ background: "transparent" }}
                ></div>
              </div>
            ))}
        </motion.div>
      </div>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#2DD4BF 1px, transparent 1px), linear-gradient(90deg, #2DD4BF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Background Ambient Animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(220,38,38,0.4) 0%, rgba(250,204,21,0.1) 100%)",
          top: "-20%",
          left: "-10%",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.3) 0%, rgba(220,38,38,0.1) 100%)",
          bottom: "-10%",
          right: "-10%",
        }}
      />

      {/* Scrollable Center Removed */}
      <div className="relative z-10 w-full h-full overflow-hidden flex flex-col items-center p-4">
        <div className="max-w-4xl w-full mx-auto my-auto flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl text-center flex flex-col w-full max-h-[95vh] overflow-y-auto"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(to bottom right, #DC2626, #991B1B)",
                boxShadow: "0 0 40px rgba(220,38,38,0.5)",
              }}
            >
              <span className="text-2xl sm:text-3xl">⚠️</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl sm:text-5xl font-black mb-3 sm:mb-5 uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#EF4444",
                textShadow:
                  "0 0 20px rgba(239,68,68,1), 0 0 40px rgba(220,38,38,0.8)",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1, 0, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {target === "admin"
                  ? data?.judul_maintenance_admin || "SYSTEM LOCKDOWN"
                  : data?.judul_maintenance_public || "SYSTEM LOCKDOWN"}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed font-mono font-bold"
              style={{
                color: "#5EEAD4",
                textShadow: "0 0 10px rgba(45,212,191,0.6)",
              }}
            >
              &gt;{" "}
              {target === "admin"
                ? data?.deskripsi_maintenance_admin ||
                  "Akses ke sektor ini dibatasi karena operasi keamanan. Silakan menjauh dari terminal."
                : data?.deskripsi_maintenance_public ||
                  "Akses ke sektor ini dibatasi karena operasi keamanan. Silakan menjauh dari terminal."}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                _
              </motion.span>
            </motion.p>

            {targetWaktuSelesaiForDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="rounded-2xl p-4 sm:p-6 mb-4"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p
                  className="text-sm font-semibold tracking-widest uppercase mb-4"
                  style={{ color: "#2DD4BF" }}
                >
                  Estimasi Selesai
                </p>

                <div className="flex justify-center gap-4 sm:gap-8">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-1 shadow-inner"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <span
                          className="text-xl sm:text-2xl font-mono font-bold"
                          style={{ color: "#FFFFFF" }}
                        >
                          {String(item.value).padStart(2, "0")}
                        </span>
                      </div>
                      <span
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: "#94A3B8" }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {isExpired ? (
                  <p
                    className="text-sm mt-6 font-semibold font-mono animate-pulse"
                    style={{ color: "#DC2626" }}
                  >
                    &gt; PERINGATAN: BATAS WAKTU TERLAMPAUI
                  </p>
                ) : (
                  <p
                    className="text-xs mt-6 font-mono"
                    style={{ color: "#94A3B8" }}
                  >
                    TARGET DEKRIPSI: {endDate} WITA
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-xs text-slate-500 flex flex-col items-center gap-2 font-mono"
            >
              <p>LOCKDOWN INITIATED: {startDate} WITA</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span style={{ color: "#DC2626" }}>
                  PROTOKOL KEAMANAN AKTIF
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
