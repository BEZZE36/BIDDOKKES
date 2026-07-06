// SignageStrip — CSS-only marquee, no JavaScript animation loop.
// The animation runs on the GPU compositor thread and is
// completely immune to React re-renders / setState calls.
"use client";

const SERVICES = [
  { num: "01", label: "MCU & Surat Sehat",         color: "#FFFFFF", bg: "rgba(11, 111, 103, 0.85)" }, // Teal
  { num: "02", label: "Vaksinasi",                 color: "#0B2340", bg: "rgba(217, 164, 65, 0.9)" }, // Gold
  { num: "03", label: "Laboratorium & Uji Narkoba",color: "#FFFFFF", bg: "rgba(11, 35, 64, 0.85)" }, // Navy
  { num: "04", label: "Psikologi",                 color: "#FFFFFF", bg: "rgba(11, 111, 103, 0.85)" }, // Teal
  { num: "05", label: "Ambulans & Rujukan",        color: "#0B2340", bg: "rgba(217, 164, 65, 0.9)" }, // Gold
  { num: "06", label: "Medikolegal (VER)",         color: "#FFFFFF", bg: "rgba(11, 35, 64, 0.85)" }, // Navy
  { num: "07", label: "DVI (Identifikasi Bencana)",color: "#FFFFFF", bg: "rgba(11, 111, 103, 0.85)" }, // Teal
];

// Duplicate once — CSS animation goes 0% → -50%, creating seamless loop
const ITEMS = [...SERVICES, ...SERVICES];

export default function SignageStrip() {
  return (
    <section
      id="signage-strip"
      className="py-6 overflow-hidden"
      style={{ background: "var(--color-paper)" }}
    >
      {/* overflow:hidden clips the track; no JS needed */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        {/*
          .marquee-track is defined in globals.css:
            animation: marquee-scroll 28s linear infinite;
          It moves translateX(0) → translateX(-50%) — since ITEMS is doubled,
          at -50% the second copy aligns perfectly with where the first started.
        */}
        <div className="marquee-track" style={{ gap: "0.75rem" }}>
          {ITEMS.map((s, i) => (
            <a
              key={i}
              href="#layanan"
              className="signage-chip"
              style={{ background: s.bg, color: s.color }}
            >
              <span className="signage-number">{s.num}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
