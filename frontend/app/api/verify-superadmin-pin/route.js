// ============================================================
// frontend/app/api/verify-superadmin-pin/route.js
// ============================================================
// GANTI TOTAL isi file lama dengan ini.
// Bedanya dari versi sebelumnya:
// - Baca PIN dari tabel `superadmin_secrets` (bukan pengaturan_sistem)
// - Kalau PIN benar, set httpOnly cookie session supaya request
//   berikutnya (update settings) bisa diverifikasi tanpa kirim PIN lagi
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../../../lib/superadminSession";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  const record = attempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { success: false, message: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const { pin } = await request.json();
  if (!pin || typeof pin !== "string") {
    return NextResponse.json(
      { success: false, message: "PIN tidak valid." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("superadmin_secrets")
    .select("pin_superadmin")
    .eq("id", 1)
    .single();

  record.count += 1;
  attempts.set(ip, record);

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: "Gagal memverifikasi PIN." },
      { status: 500 }
    );
  }

  const isValid = pin === data.pin_superadmin;
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "PIN salah." },
      { status: 401 }
    );
  }

  attempts.delete(ip);

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
