/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function AdminAboutManager() {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  async function fetchImage() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("about_image").select("*").order("updated_at", { ascending: false }).limit(1);
    setCurrentImage(data && data.length > 0 ? data[0] : null);
    setLoading(false);
  }

  useEffect(() => { setTimeout(() => { fetchImage(); }, 0); }, []);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !supabase) return;

    setUploading(true);
    setMsg({ text: "", ok: true });

    const ext = file.name.split(".").pop();
    const path = `about/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("media").upload(path, file);
    if (upErr) {
      setMsg({ text: "Gagal upload: " + upErr.message, ok: false });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    const image_url = urlData.publicUrl;

    if (currentImage) {
      const { error } = await supabase.from("about_image").update({ image_url, updated_at: new Date().toISOString() }).eq("id", currentImage.id);
      if (error) { setMsg({ text: "Gagal simpan: " + error.message, ok: false }); setUploading(false); return; }
    } else {
      const { error } = await supabase.from("about_image").insert({ image_url });
      if (error) { setMsg({ text: "Gagal simpan: " + error.message, ok: false }); setUploading(false); return; }
    }

    setMsg({ text: "✅ Foto profil berhasil diperbarui!", ok: true });
    setUploading(false);
    fetchImage();

    // Reset input
    const input = document.getElementById("about-click-input");
    if (input) input.value = "";
  }

  async function handleSeedDefault() {
    if (!supabase) return;
    const { error } = await supabase.from("about_image").insert({ image_url: FALLBACK_IMAGE });
    if (error) { setMsg({ text: "Gagal: " + error.message, ok: false }); return; }
    setMsg({ text: "Foto default berhasil disimpan!", ok: true });
    fetchImage();
  }

  const displayImage = currentImage?.image_url || FALLBACK_IMAGE;

  return (
    <div>
      {/* Seed Banner */}
      {!loading && !currentImage && (
        <div className="rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
          style={{ background: "rgba(217,164,65,0.1)", border: "1px solid rgba(217,164,65,0.4)" }}>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--adm-gold)" }}>Belum ada foto di database</p>
            <p className="text-xs mt-1" style={{ color: "var(--adm-text-muted)" }}>Tabel <code>about_image</code> kosong. Jalankan SQL setup terlebih dahulu, lalu klik tombol di bawah.</p>
          </div>
          <button onClick={handleSeedDefault}
            className="text-xs px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: "var(--adm-gold)", color: "#0B2340" }}>
            💾 Simpan Default
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid sm:grid-cols-2 gap-8 items-start">

        {/* ── Clickable Image Preview ─────── */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--adm-text)" }}>Foto Profil Saat Ini</p>
          <p className="text-xs mb-4" style={{ color: "var(--adm-text-muted)" }}>
            Klik foto untuk langsung mengganti gambar.
          </p>

          {/* Hidden file input */}
          <input
            id="about-click-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {/* Clickable image — same UX as admin avatar */}
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
            style={{
              aspectRatio: "3/4",
              maxWidth: "280px",
              border: "3px solid var(--adm-teal)",
            }}
            onClick={() => !uploading && document.getElementById("about-click-input").click()}
            title="Klik untuk mengganti foto profil"
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--adm-mist)" }}>
                <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--adm-border)", borderTopColor: "var(--adm-teal)" }} />
              </div>
            ) : (
              <img
                src={displayImage}
                alt="Foto Profil Tentang"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <p className="text-white text-sm font-semibold">Mengunggah...</p>
                </>
              ) : (
                <>
                  <span className="text-3xl">📸</span>
                  <p className="text-white text-sm font-bold">Klik untuk Ganti Foto</p>
                  <p className="text-white/70 text-xs">Disarankan rasio 3:4 (portrait)</p>
                </>
              )}
            </div>
          </div>

          {msg.text && (
            <p className="text-sm mt-3 font-semibold" style={{ color: msg.ok ? "var(--adm-teal)" : "#F87171" }}>
              {msg.text}
            </p>
          )}
        </div>

        {/* ── Info Panel ─────────────────── */}
        <div className="rounded-xl p-5" style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 12px var(--adm-shadow)" }}>
          <h3 className="font-bold text-base mb-1" style={{ color: "var(--adm-text)" }}>👤 Foto Profil Tentang</h3>
          <p className="text-xs mb-5" style={{ color: "var(--adm-text-muted)" }}>
            Foto ini ditampilkan di section <strong>&quot;Tentang&quot;</strong> pada halaman utama website.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--adm-mist)" }}>
              <span className="text-lg">📐</span>
              <div>
                <p className="font-semibold text-xs" style={{ color: "var(--adm-text)" }}>Rasio yang Disarankan</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--adm-text-muted)" }}>3:4 (portrait) — Contoh: 600×800px atau 900×1200px</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--adm-mist)" }}>
              <span className="text-lg">🗜</span>
              <div>
                <p className="font-semibold text-xs" style={{ color: "var(--adm-text)" }}>Format yang Didukung</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--adm-text-muted)" }}>JPG, PNG, WebP. Ukuran maksimal: 5MB</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--adm-mist)" }}>
              <span className="text-lg">⚡</span>
              <div>
                <p className="font-semibold text-xs" style={{ color: "var(--adm-text)" }}>Cara Ganti Foto</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--adm-text-muted)" }}>Klik langsung pada foto di sebelah kiri, lalu pilih file baru.</p>
              </div>
            </div>
          </div>

          {currentImage && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(14,140,130,0.1)", border: "1px solid var(--adm-teal-soft)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--adm-teal)" }}>✅ Foto aktif tersimpan di database</p>
              <p className="text-xs mt-1 truncate" style={{ color: "var(--adm-text-muted)" }}>{currentImage.image_url}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
