"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Lightbox({ src, alt, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10,31,68,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Image container — max 90vw x 85vh */}
          <motion.div
            key="lightbox-image"
            initial={{ scale: 0.75, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.75, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
              border: "2px solid rgba(217,164,65,0.4)",
            }}
          >
            {/* next/image optimization for Lightbox */}
            <div style={{ position: "relative", width: "90vw", height: "85vh" }}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "rgba(10,31,68,0.8)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >×</button>
            {/* Caption */}
            {alt && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "0.75rem 1rem",
                background: "linear-gradient(transparent, rgba(10,31,68,0.85))",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}>
                {alt}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
