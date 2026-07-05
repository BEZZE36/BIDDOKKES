/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminGalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ judul: "", deskripsi: "", file: null, tipe_media: "gambar" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", ok: true });

  async function fetchItems() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("galeri").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { setTimeout(() => { fetchItems(); }, 0); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supabase) return;
    setUploading(true); setMsg({ text: "", ok: true });

    let media_url = "";
    if (form.file) {
      const ext = form.file.name.split(".").pop();
      const path = `galeri/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, form.file);
      if (upErr) { setMsg({ text: "Gagal upload: " + upErr.message, ok: false }); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      media_url = urlData.publicUrl;
    }

    if (editId) {
      const update = { judul: form.judul, deskripsi: form.deskripsi, tipe_media: form.tipe_media };
      if (media_url) update.media_url = media_url;
      const { error: dbErr } = await supabase.from("galeri").update(update).eq("id", editId);
      if (dbErr) { setMsg({ text: "Gagal simpan: " + dbErr.message, ok: false }); setUploading(false); return; }
      setMsg({ text: "Berhasil diperbarui!", ok: true });
    } else {
      if (!media_url) { setMsg({ text: "Pilih file untuk diunggah.", ok: false }); setUploading(false); return; }
      const { error: dbErr } = await supabase.from("galeri").insert({ judul: form.judul, deskripsi: form.deskripsi, media_url, tipe_media: form.tipe_media });
      if (dbErr) { setMsg({ text: "Gagal simpan: " + dbErr.message, ok: false }); setUploading(false); return; }
      setMsg({ text: "Berhasil ditambahkan!", ok: true });
    }

    setForm({ judul: "", deskripsi: "", file: null, tipe_media: "gambar" });
    setEditId(null);
    setUploading(false);
    fetchItems();
  }

  async function handleDelete(id) {
    if (!supabase) return;
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    const { error } = await supabase.from("galeri").delete().eq("id", id);
    if (error) { alert("Gagal menghapus: " + error.message); return; }
    fetchItems();
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm({ judul: item.judul, deskripsi: item.deskripsi || "", file: null, tipe_media: item.tipe_media });
  }

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-xl p-5 mb-6"
        style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 12px var(--adm-shadow)" }}>
        <h3 className="font-bold mb-4 text-base" style={{ color: "var(--adm-text)" }}>
          {editId ? "✏️ Edit Item Galeri" : "➕ Tambah Item Galeri"}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Judul</label>
            <input type="text" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--adm-border)", background: "var(--adm-input-bg)", color: "var(--adm-text)" }} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tipe Media</label>
            <select value={form.tipe_media} onChange={(e) => setForm({ ...form, tipe_media: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--adm-border)", background: "var(--adm-input-bg)", color: "var(--adm-text)" }}>
              <option value="gambar">Gambar</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Deskripsi</label>
          <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={2}
            className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--adm-border)", background: "var(--adm-input-bg)", color: "var(--adm-text)" }} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">File {editId && "(opsional)"}</label>
          <input type="file" accept="image/*,video/*" onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#0D2E2B] file:text-[#0E8C82] hover:file:bg-[#0E8C82] hover:file:text-white file:cursor-pointer file:transition-all cursor-pointer"
            style={{ color: "var(--adm-text-muted)" }} />
        </div>
        {msg.text && <p className="text-sm mb-3 font-semibold" style={{ color: msg.ok ? "var(--adm-teal)" : "#F87171" }}>{msg.text}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={uploading} className="btn-primary text-sm">{uploading ? "Mengunggah..." : editId ? "Simpan Perubahan" : "Unggah"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ judul: "", deskripsi: "", file: null, tipe_media: "gambar" }); }} className="btn-secondary text-sm">Batal</button>}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Belum ada item galeri.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden"
              style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 8px var(--adm-shadow)" }}>
              {item.tipe_media === "video" ? (
                <video src={item.media_url} controls className="w-full h-48 object-contain bg-black" />
              ) : (
                <img src={item.media_url} alt={item.judul} className="w-full h-48 object-cover"
                  style={{ background: "var(--adm-mist)" }} />
              )}
              <div className="p-3">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--adm-text)" }}>{item.judul}</p>
                <p className="text-xs mt-1 truncate" style={{ color: "var(--adm-text-muted)" }}>{item.deskripsi}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit(item)} className="text-xs px-3 py-1 rounded font-semibold transition-colors"
                    style={{ background: "var(--adm-teal-soft)", color: "var(--adm-teal)" }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded font-semibold"
                    style={{ background: "rgba(220,38,38,0.15)", color: "#F87171" }}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
