"use client";
import { useRef, useState } from "react";

export default function SpotlightCard({ children, className = "", style = {}, spotlightColor = "rgba(14,140,130,0.12)" }) {
  const divRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e) {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <div
      ref={divRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{
        ...style,
        background: isHovered 
          ? `radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 80%), var(--card-bg, transparent)`
          : "var(--card-bg, transparent)",
        transition: "background 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
