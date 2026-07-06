/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ConfirmModal from "./animations/ConfirmModal";

const DEFAULT_SLIDES = [
  { image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", judul: "BIDDOKKES POLDA SULTENG", subtitle: "Bidang Kedokteran dan Kesehatan Kepolisian Daerah Sulawesi Tengah", urutan: 0 },
  { image_url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", judul: "PELAYANAN PRIMA", subtitle: "Mengutamakan pengabdian kepada masyarakat dalam setiap layanan kesehatan", urutan: 1 },
  { image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", judul: "KESAMAPTAAN PERSONEL", subtitle: "Mendukung tugas pokok dan fungsi Polri melalui kesehatan yang optimal", urutan: 2 },
];

export default function AdminHeroManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({ judul: "", subtitle: "", file: null, urutan: 0, warna_teks: "#FFFFFF" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  async function fetchSlides() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("hero_slides").select("*").order("urutan", { ascending: true });
    setSlides(data || []);
    setLoading(false);
  }

  useEffect(() => { setTimeout(() => { fetchSlides(); }, 0); }, []);

  async function seedDefaults() {
    if (!supabase) return;
    setSeeding(true);
    const { error } = await supabase.from("hero_slides").insert(DEFAULT_SLIDES);
    if (error) { setMsg({ text: "Gagal seed: " + error.message, ok: false }); } 
    else { setMsg({ text: "Slide default berhasil ditambahkan!", ok: true }); fetchSlides(); }
    setSeeding(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supabase) return;
    setUploading(true); setMsg({ text: "", ok: true });

    let image_url = "";
    if (form.file) {
      const ext = form.file.name.split(".").pop();
      const path = `hero/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, form.file);
      if (upErr) { setMsg({ text: "Gagal upload: " + upErr.message, ok: false }); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    if (editId) {
      const update = { judul: form.judul, subtitle: form.subtitle, urutan: Number(form.urutan), warna_teks: form.warna_teks };
      if (image_url) update.image_url = image_url;
      const { error } = await supabase.from("hero_slides").update(update).eq("id", editId);
      if (error) { setMsg({ text: "Gagal simpan: " + error.message, ok: false }); setUploading(false); return; }
      setMsg({ text: "Slide berhasil diperbarui!", ok: true });
    } else {
      if (!image_url) { setMsg({ text: "Pilih file gambar untuk diunggah.", ok: false }); setUploading(false); return; }
      const { error } = await supabase.from("hero_slides").insert({ judul: form.judul, subtitle: form.subtitle, image_url, urutan: Number(form.urutan), warna_teks: form.warna_teks });
      if (error) { setMsg({ text: "Gagal simpan: " + error.message, ok: false }); setUploading(false); return; }
      setMsg({ text: "Slide berhasil ditambahkan!", ok: true });
    }

    setForm({ judul: "", subtitle: "", file: null, urutan: slides.length, warna_teks: "#FFFFFF" });
    setEditId(null); setUploading(false);
    fetchSlides();
  }

  async function handleDelete(id) {
    if (!supabase) return;
    setConfirmState({ open: true, id });
  }

  async function doDelete() {
    const id = confirmState.id;
    setConfirmState({ open: false, id: null });
    if (!id) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    fetchSlides();
  }

  async function moveSlide(id, dir) {
    if (!supabase) return;
    const idx = slides.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    const a = slides[idx]; const b = slides[swapIdx];
    await supabase.from("hero_slides").update({ urutan: b.urutan }).eq("id", a.id);
    await supabase.from("hero_slides").update({ urutan: a.urutan }).eq("id", b.id);
    fetchSlides();
  }

  function startEdit(slide) {
    setEditId(slide.id);
    setForm({ judul: slide.judul, subtitle: slide.subtitle || "", file: null, urutan: slide.urutan, warna_teks: slide.warna_teks || "#FFFFFF" });
  }

  const inputStyle = { border: "1px solid var(--adm-border)", background: "var(--adm-input-bg)", color: "var(--adm-text)" };

  return (
    <div>
      <ConfirmModal
        isOpen={confirmState.open}
        message="Yakin ingin menghapus slide hero ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={doDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
      {/* Seed Banner */}
      {!loading && slides.length === 0 && (
        <div className="rounded-xl p-5 mb-6 flex items-center justify-between gap-4"
          style={{ background: "rgba(217,164,65,0.1)", border: "1px solid rgba(217,164,65,0.4)" }}>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--adm-gold)" }}>Belum ada slide Hero</p>
            <p className="text-xs mt-1" style={{ color: "var(--adm-text-muted)" }}>Tambah slide default atau buat sendiri di bawah.</p>
          </div>
          <button onClick={seedDefaults} disabled={seeding}
            className="text-xs px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: "var(--adm-gold)", color: "#0B2340" }}>
            {seeding ? "Menambahkan..." : "➕ Slide Default"}
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-xl p-5 mb-6"
        style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 12px var(--adm-shadow)" }}>
        <h3 className="font-bold mb-4 text-base" style={{ color: "var(--adm-text)" }}>
          {editId ? "✏️ Edit Slide Hero" : "➕ Tambah Slide Hero"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Judul Slide</label>
            <input type="text" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
              placeholder="Contoh: BIDDOKKES POLDA SULTENG"
              className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Urutan Tampil</label>
            <input type="number" min={0} value={form.urutan} onChange={(e) => setForm({ ...form, urutan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Subtitle / Deskripsi</label>
          <textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows={2}
            placeholder="Kalimat singkat di bawah judul..."
            className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Warna Teks</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.warna_teks} onChange={(e) => setForm({ ...form, warna_teks: e.target.value })}
              className="w-12 h-10 p-1 rounded cursor-pointer" style={{ background: "var(--adm-input-bg)", border: "1px solid var(--adm-border)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--adm-text-muted)" }}>{form.warna_teks}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Gambar Background {editId && "(opsional)"}</label>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#0D2E2B] file:text-teal-600 hover:file:bg-teal-600 hover:file:text-white file:cursor-pointer file:transition-all cursor-pointer"
            style={{ color: "var(--adm-text-muted)" }} />
          <p className="text-xs mt-1" style={{ color: "var(--adm-text-muted)" }}>Disarankan ukuran landscape (1920×1080+)</p>
        </div>
        {msg.text && <p className="text-sm mb-3 font-semibold" style={{ color: msg.ok ? "var(--adm-teal)" : "#F87171" }}>{msg.text}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={uploading} className="btn-primary text-sm">{uploading ? "Mengunggah..." : editId ? "Simpan Perubahan" : "Unggah Slide"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ judul: "", subtitle: "", file: null, urutan: slides.length, warna_teks: "#FFFFFF" }); }} className="btn-secondary text-sm">Batal</button>}
        </div>
      </form>

      {/* Slide List */}
      {loading ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Memuat...</p>
      ) : slides.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Belum ada slide. Tambah di atas atau gunakan slide default.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-semibold" style={{ color: "var(--adm-text-muted)" }}>Slide aktif ({slides.length})</p>
          {slides.map((slide, idx) => (
            <div key={slide.id} className="rounded-xl overflow-hidden flex gap-4 p-3 items-center"
              style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 8px var(--adm-shadow)" }}>
              <img src={slide.image_url} alt={slide.judul} className="w-32 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--adm-text)" }}>{slide.judul}</p>
                <p className="text-xs mt-1 truncate" style={{ color: "var(--adm-text-muted)" }}>{slide.subtitle}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: "var(--adm-teal)" }}>Urutan: {slide.urutan}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => moveSlide(slide.id, -1)} disabled={idx === 0}
                  className="text-xs px-2 py-1 rounded font-bold disabled:opacity-30 transition-opacity"
                  style={{ background: "var(--adm-mist)", color: "var(--adm-text)" }}>▲</button>
                <button onClick={() => moveSlide(slide.id, 1)} disabled={idx === slides.length - 1}
                  className="text-xs px-2 py-1 rounded font-bold disabled:opacity-30 transition-opacity"
                  style={{ background: "var(--adm-mist)", color: "var(--adm-text)" }}>▼</button>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(slide)} className="text-xs px-3 py-1.5 rounded font-semibold"
                  style={{ background: "var(--adm-teal-soft)", color: "var(--adm-teal)" }}>Edit</button>
                <button onClick={() => handleDelete(slide.id)} className="text-xs px-3 py-1.5 rounded font-semibold"
                  style={{ background: "rgba(220,38,38,0.15)", color: "#F87171" }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
