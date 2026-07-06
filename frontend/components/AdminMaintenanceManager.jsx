"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

const DEFAULT = {
  is_maintenance_public: false,
  is_maintenance_admin: false,
  judul_maintenance_public: "SYSTEM LOCKDOWN",
  judul_maintenance_admin: "RESTRICTED AREA",
  deskripsi_maintenance_public:
    "Sistem keamanan sedang melakukan enkripsi dan peningkatan protokol. Akses ditolak sementara.",
  deskripsi_maintenance_admin:
    "Akses ke sektor ini dibatasi karena operasi keamanan. Silakan menjauh dari terminal.",
  waktu_selesai_public: "",
  waktu_selesai_admin: "",
};

export default function AdminMaintenanceManager() {
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch current settings ──────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data, error: err } = await supabase
        .from("pengaturan_sistem")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setForm({
          is_maintenance_public: data.is_maintenance_public ?? false,
          is_maintenance_admin: data.is_maintenance_admin ?? false,
          judul_maintenance_public: data.judul_maintenance_public ?? DEFAULT.judul_maintenance_public,
          judul_maintenance_admin: data.judul_maintenance_admin ?? DEFAULT.judul_maintenance_admin,
          deskripsi_maintenance_public: data.deskripsi_maintenance_public ?? DEFAULT.deskripsi_maintenance_public,
          deskripsi_maintenance_admin: data.deskripsi_maintenance_admin ?? DEFAULT.deskripsi_maintenance_admin,
          waktu_selesai_public: data.waktu_selesai_public
            ? new Date(data.waktu_selesai_public).toISOString().slice(0, 16)
            : "",
          waktu_selesai_admin: data.waktu_selesai_admin
            ? new Date(data.waktu_selesai_admin).toISOString().slice(0, 16)
            : "",
        });
      }
      if (err) setError("Gagal memuat pengaturan: " + err.message);
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const payload = {
      is_maintenance_public: form.is_maintenance_public,
      is_maintenance_admin: form.is_maintenance_admin,
      judul_maintenance_public: form.judul_maintenance_public,
      judul_maintenance_admin: form.judul_maintenance_admin,
      deskripsi_maintenance_public: form.deskripsi_maintenance_public,
      deskripsi_maintenance_admin: form.deskripsi_maintenance_admin,
      waktu_selesai_public: form.waktu_selesai_public
        ? new Date(form.waktu_selesai_public).toISOString()
        : null,
      waktu_selesai_admin: form.waktu_selesai_admin
        ? new Date(form.waktu_selesai_admin).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    const { error: err } = await supabase
      .from("pengaturan_sistem")
      .update(payload)
      .eq("id", 1);

    if (err) {
      setError("Gagal menyimpan: " + err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: "var(--adm-border)", borderTopColor: "var(--adm-teal)" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto py-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--adm-text)" }}>
          ⚙️ Pengaturan Sistem
        </h2>
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>
          Aktifkan mode pemeliharaan untuk memblokir akses ke halaman publik atau admin.
        </p>
      </div>

      {/* ── Public Maintenance ─────────────────────────────────────── */}
      <Section title="🌐 Pemeliharaan Publik" subtitle="Memblokir halaman utama dan semua halaman publik">
        <Toggle
          label="Aktifkan mode pemeliharaan publik"
          checked={form.is_maintenance_public}
          onChange={(v) => handleChange("is_maintenance_public", v)}
          danger
        />
        {form.is_maintenance_public && (
          <>
            <Field
              label="Judul Peringatan"
              value={form.judul_maintenance_public}
              onChange={(v) => handleChange("judul_maintenance_public", v)}
            />
            <Field
              label="Deskripsi"
              value={form.deskripsi_maintenance_public}
              onChange={(v) => handleChange("deskripsi_maintenance_public", v)}
              multiline
            />
            <Field
              label="Estimasi Selesai (opsional)"
              value={form.waktu_selesai_public}
              onChange={(v) => handleChange("waktu_selesai_public", v)}
              type="datetime-local"
            />
          </>
        )}
      </Section>

      {/* ── Admin Maintenance ──────────────────────────────────────── */}
      <Section title="🔒 Pemeliharaan Admin" subtitle="Memblokir akses ke panel admin">
        <Toggle
          label="Aktifkan mode pemeliharaan admin"
          checked={form.is_maintenance_admin}
          onChange={(v) => handleChange("is_maintenance_admin", v)}
          danger
        />
        {form.is_maintenance_admin && (
          <>
            <Field
              label="Judul Peringatan"
              value={form.judul_maintenance_admin}
              onChange={(v) => handleChange("judul_maintenance_admin", v)}
            />
            <Field
              label="Deskripsi"
              value={form.deskripsi_maintenance_admin}
              onChange={(v) => handleChange("deskripsi_maintenance_admin", v)}
              multiline
            />
            <Field
              label="Estimasi Selesai (opsional)"
              value={form.waktu_selesai_admin}
              onChange={(v) => handleChange("waktu_selesai_admin", v)}
              type="datetime-local"
            />
          </>
        )}
      </Section>

      {/* ── Save ──────────────────────────────────────────────────── */}
      {error && (
        <p className="text-sm px-4 py-3 rounded-lg" style={{ background: "rgba(220,38,38,0.15)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,0.3)" }}>
          ⚠️ {error}
        </p>
      )}

      <button
        id="btn-save-maintenance"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl font-bold text-sm transition-all"
        style={{
          background: saved ? "#059669" : saving ? "var(--adm-border)" : "var(--adm-teal)",
          color: "#FFFFFF",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Menyimpan..." : saved ? "✅ Tersimpan!" : "💾 Simpan Pengaturan"}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--adm-text-muted)" }}>
        Perubahan berlaku secara real-time di semua perangkat yang membuka website.
      </p>
    </motion.div>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────

function Section({ title, subtitle, children }) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)" }}
    >
      <div>
        <p className="font-bold text-base" style={{ color: "var(--adm-text)" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--adm-text-muted)" }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange, danger }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0"
        style={{ background: checked ? (danger ? "#DC2626" : "var(--adm-teal)") : "var(--adm-border)" }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
        />
      </div>
      <span className="text-sm font-semibold select-none" style={{ color: checked && danger ? "#FCA5A5" : "var(--adm-text)" }}>
        {label}
        {checked && danger && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold animate-pulse" style={{ background: "rgba(220,38,38,0.2)", color: "#FCA5A5" }}>
            AKTIF
          </span>
        )}
      </span>
    </label>
  );
}

function Field({ label, value, onChange, multiline, type = "text" }) {
  const sharedStyle = {
    background: "var(--adm-input-bg)",
    color: "var(--adm-text)",
    border: "1px solid var(--adm-border)",
    borderRadius: 8,
    padding: "8px 12px",
    width: "100%",
    fontSize: 13,
    outline: "none",
  };
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold" style={{ color: "var(--adm-text-muted)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      )}
    </div>
  );
}
