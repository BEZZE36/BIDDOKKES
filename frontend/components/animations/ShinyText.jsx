"use client";

/**
 * ShinyText — sweeping shimmer animation on text.
 * Keyframes are defined in globals.css to prevent stutter on re-renders.
 * @param {string}  text        - text to display
 * @param {string}  shineColor  - the highlight color in the sweep
 * @param {number}  speed       - animation duration in seconds
 */
export default function ShinyText({ text, className = "", style = {}, speed = 3, shineColor = "rgba(255,255,255,0.75)" }) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(120deg, currentColor 35%, ${shineColor} 50%, currentColor 65%)`,
        backgroundSize: "250% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: `shiny-sweep ${speed}s linear infinite`,
        ...style,
      }}
    >
      {text}
    </span>
  );
}
