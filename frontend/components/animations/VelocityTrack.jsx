"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function VelocityTrack({ children, baseVelocity = -3 }) {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 3000], [0, baseVelocity * -500]);
  const springX = useSpring(x, { damping: 50, stiffness: 100 });

  return (
    <div ref={containerRef} style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        style={{ x: springX, display: "flex", gap: "2rem", whiteSpace: "nowrap", width: "max-content" }}
      >
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default VelocityTrack;
