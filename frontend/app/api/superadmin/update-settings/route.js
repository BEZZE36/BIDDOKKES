// ============================================================
// frontend/app/api/superadmin/update-settings/route.js
// ============================================================
// File BARU. Buat foldernya: frontend/app/api/superadmin/update-settings/route.js
//
// Endpoint ini menggantikan SEMUA pemanggilan langsung
// `supabase.from("pengaturan_sistem").update(...)` dari SuperAdminPage.
// Hanya bisa dipakai kalau request punya cookie session yang valid
// (didapat setelah verifikasi PIN berhasil di /api/verify-superadmin-pin).
// Update-nya sendiri pakai service_role key, yang bypass RLS — jadi
// RLS tabel pengaturan_sistem boleh dikunci rapat dari sisi client.
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../../../lib/superadminSession";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Whitelist kolom yang boleh diupdate lewat endpoint ini.
// Ini penting supaya client tidak bisa iseng kirim field lain
// (misalnya field yang tidak ada, atau mencoba menimpa kolom lain).
const ALLOWED_FIELDS = [
  "is_maintenance_public",
  "is_maintenance_admin",
  "judul_maintenance_public",
  "judul_maintenance_admin",
  "deskripsi_maintenance_public",
  "deskripsi_maintenance_admin",
  "waktu_mulai",
  "waktu_selesai_public",
  "waktu_selesai_admin",
];

export async function POST(request) {
  const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(cookieToken)) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak valid atau sudah kedaluwarsa. Silakan login ulang." },
      { status: 401 }
    );
  }

  const body = await request.json();

  // Filter payload, cuma ambil field yang di-whitelist
  const updatePayload = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updatePayload[key] = body[key];
  }
  updatePayload.updated_at = new Date().toISOString();

  if (Object.keys(updatePayload).length === 1) {
    // cuma ada updated_at, berarti tidak ada field valid yang dikirim
    return NextResponse.json(
      { success: false, message: "Tidak ada data valid untuk diupdate." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("pengaturan_sistem")
    .update(updatePayload)
    .eq("id", 1);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan pengaturan: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
