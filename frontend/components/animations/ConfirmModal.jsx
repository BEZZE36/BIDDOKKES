"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ConfirmModal — Premium animated delete-confirmation dialog
 * Inspired by ReactBits component aesthetics.
 *
 * Props:
 *   isOpen    boolean     — show/hide
 *   message   string      — confirmation question
 *   onConfirm () => void  — called when user clicks confirm
 *   onCancel  () => void  — called when user clicks cancel / clicks backdrop
 *   danger    boolean     — red theme (default true)
 */
export default function ConfirmModal({
  isOpen,
  message = "Yakin ingin menghapus item ini?",
  onConfirm,
  onCancel,
  danger = true,
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && isOpen) onCancel?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-9998"
            style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.55)" }}
          />

          {/* ── Modal Card ───────────────────────────────────────── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed inset-0 z-9999 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(30,41,59,0.95))",
                border: danger
                  ? "1px solid rgba(220,38,38,0.4)"
                  : "1px solid rgba(14,140,130,0.4)",
                boxShadow: danger
                  ? "0 0 40px rgba(220,38,38,0.15), 0 20px 60px rgba(0,0,0,0.4)"
                  : "0 0 40px rgba(14,140,130,0.15), 0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              {/* Decorative ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: danger
                    ? "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(14,140,130,0.2) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* ── Icon ─────────────────────────────────────── */}
              <div className="flex justify-center mb-5">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: danger
                      ? "linear-gradient(135deg, rgba(220,38,38,0.25), rgba(239,68,68,0.15))"
                      : "linear-gradient(135deg, rgba(14,140,130,0.25), rgba(20,184,166,0.15))",
                    border: danger
                      ? "1px solid rgba(220,38,38,0.35)"
                      : "1px solid rgba(14,140,130,0.35)",
                    boxShadow: danger
                      ? "0 0 20px rgba(220,38,38,0.2)"
                      : "0 0 20px rgba(14,140,130,0.2)",
                  }}
                >
                  {danger ? "🗑️" : "⚠️"}
                </motion.div>
              </div>

              {/* ── Message ──────────────────────────────────── */}
              <p
                className="text-center text-sm leading-relaxed mb-6 font-medium"
                style={{ color: "#CBD5E1" }}
              >
                {message}
              </p>

              {/* ── Divider ──────────────────────────────────── */}
              <div
                className="mb-5 h-px w-full"
                style={{
                  background: danger
                    ? "linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(14,140,130,0.3), transparent)",
                }}
              />

              {/* ── Buttons ──────────────────────────────────── */}
              <div className="flex gap-3">
                {/* Cancel */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#94A3B8",
                  }}
                >
                  Batal
                </motion.button>

                {/* Confirm */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: danger
                      ? "linear-gradient(135deg, #DC2626, #991B1B)"
                      : "linear-gradient(135deg, #0E8C82, #0B6F67)",
                    border: danger
                      ? "1px solid rgba(220,38,38,0.5)"
                      : "1px solid rgba(14,140,130,0.5)",
                    color: "#FFFFFF",
                    boxShadow: danger
                      ? "0 0 16px rgba(220,38,38,0.35)"
                      : "0 0 16px rgba(14,140,130,0.35)",
                  }}
                >
                  {danger ? "Hapus" : "Konfirmasi"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
