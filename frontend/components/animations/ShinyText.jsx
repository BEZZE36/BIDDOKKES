"use client";

export default function ShinyText({ text, className = "", style = {}, speed = 3 }) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(120deg, currentColor 40%, rgba(255,255,255,0.7) 50%, currentColor 60%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: `shine ${speed}s linear infinite`,
        ...style,
      }}
    >
      {text}
      <style>{`
        @keyframes shine {
          from { background-position: 200% center; }
          to { background-position: -200% center; }
        }
      `}</style>
    </span>
  );
}
