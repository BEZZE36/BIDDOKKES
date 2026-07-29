"use client";
import { useEffect } from "react";

const STYLE_ID = "shiny-sweep-keyframe";

/**
 * ShinyText — sweeping shimmer animation on text.
 * Injects @keyframes once into <head> to prevent SSR/hydration stutter.
 * @param {string}  text        - text to display
 * @param {string}  shineColor  - highlight color in the sweep
 * @param {number}  speed       - animation duration in seconds
 */
export default function ShinyText({
  text,
  className = "",
  style = {},
  speed = 3,
  shineColor = "rgba(255,255,255,0.75)",
}) {
  // Inject keyframe into <head> exactly once per page lifetime — no per-render re-injection
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
      @keyframes shiny-sweep {
        from { background-position: 200% center; }
        to   { background-position: -200% center; }
      }
    `;
    document.head.appendChild(el);
  }, []);

  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(120deg, currentColor 35%, ${shineColor} 50%, currentColor 65%)`,
        backgroundSize: "250% auto",
        /* Match the 'from' keyframe so there's zero jump on first paint */
        backgroundPosition: "200% center",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: `shiny-sweep ${speed}s linear infinite`,
        /* Apply animation initial state before first paint — eliminates stutter */
        animationFillMode: "both",
        /* Required for backgroundClip:text to work reliably on inline elements */
        display: "inline-block",
        ...style,
      }}
    >
      {text}
    </span>
  );
}
