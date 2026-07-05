"use client";
import { useMemo, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export default function SplitText({
  text = "",
  className = "",
  delay = 50,
  duration = 0.6,
  ease = "easeOut",
  once = true,
  tag: Tag = "p",
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-40px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
    else if (!once) controls.start("hidden");
  }, [inView, controls, once]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: delay / 1000 } },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration, ease } },
  };

  return (
    <Tag className={className}>
      <motion.span
        ref={ref}
        variants={container}
        initial="hidden"
        animate={controls}
        style={{ display: "inline" }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariant} style={{ display: "inline-block", marginRight: "0.25em" }}>
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
