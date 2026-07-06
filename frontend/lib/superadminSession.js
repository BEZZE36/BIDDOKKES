// ============================================================
// frontend/lib/superadminSession.js
// ============================================================
// Session sederhana berbasis signed cookie (HMAC-SHA256), tanpa
// perlu Supabase Auth atau library tambahan. Dipakai supaya API
// route bisa memverifikasi bahwa request datang dari seseorang
// yang sudah lolos cek PIN, tanpa perlu Supabase session asli.
//
// WAJIB: tambahkan environment variable SUPERADMIN_SESSION_SECRET
// (string acak panjang, minimal 32 karakter) di .env.local dan di
// Vercel Environment Variables. JANGAN pakai prefix NEXT_PUBLIC_.
// Contoh generate secret: openssl rand -hex 32
// ============================================================

import crypto from "crypto";

const SECRET = process.env.SUPERADMIN_SESSION_SECRET;
const SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 jam
export const SESSION_COOKIE_NAME = "biddokkes_superadmin_session";

function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

// Membuat token session baru: "expiresAt.signature"
export function createSessionToken() {
  if (!SECRET) {
    throw new Error(
      "SUPERADMIN_SESSION_SECRET belum di-set di environment variables."
    );
  }
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  const signature = sign(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

// Memvalidasi token dari cookie. Return true kalau valid & belum expired.
export function verifySessionToken(token) {
  if (!SECRET || !token) return false;
  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expectedSignature = sign(expiresAtStr);
  // Bandingkan pakai timing-safe compare, hindari timing attack
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;
