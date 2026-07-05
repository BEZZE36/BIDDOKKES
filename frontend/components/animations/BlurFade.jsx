// BlurFade — Scroll-triggered reveal animation (ReactBits style)
// Elements fade in + slide up + unblur as they enter the viewport.
"use client";
import { useEffect, useRef } from "react";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.delay=0]        - delay in ms before animation starts
 * @param {number} [props.duration=600]   - animation duration in ms
 * @param {string} [props.direction="up"] - "up" | "down" | "left" | "right"
 * @param {number} [props.distance=24]    - translate distance in px
 * @param {string} [props.className]
 * @param {object} [props.style]
 */
export default function BlurFade({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  distance = 24,
  className = "",
  style = {},
}) {
  const ref = useRef(null);

  const translate = {
    up:    `translateY(${distance}px)`,
    down:  `translateY(-${distance}px)`,
    left:  `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  }[direction] ?? `translateY(${distance}px)`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial hidden state
    el.style.opacity = "0";
    el.style.transform = translate;
    el.style.filter = "blur(8px)";
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                           transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                           filter ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translate(0,0)";
            el.style.filter = "blur(0px)";
            observer.unobserve(el); // only animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className} style={{ willChange: "opacity, transform, filter", ...style }}>
      {children}
    </div>
  );
}
