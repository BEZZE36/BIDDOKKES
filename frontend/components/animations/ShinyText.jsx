"use client";

/**
 * ShinyText — sweeping shimmer animation on text.
 * @param {string}  text        - text to display
 * @param {string}  shineColor  - the highlight color in the sweep (defaults to gold, visible in both modes)
 * @param {number}  speed       - animation duration in seconds
 */
export default function ShinyText({ text, className = "", style = {}, speed = 3, shineColor = "rgba(217,164,65,0.85)" }) {
  const animName = `shine_${speed}`;
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(120deg, currentColor 35%, ${shineColor} 50%, currentColor 65%)`,
        backgroundSize: "250% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: `${animName} ${speed}s linear infinite`,
        ...style,
      }}
    >
      {text}
      <style>{`
        @keyframes ${animName} {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
      `}</style>
    </span>
  );
}
