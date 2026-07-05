"use client";
import { useRef, useEffect, useState } from "react";

export default function TiltedCard({ children, className = "", style = {}, tiltAmount = 6 }) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * tiltAmount}deg) rotateX(${-y * tiltAmount}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 0.15s ease", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
