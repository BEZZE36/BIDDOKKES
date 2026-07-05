/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminNewsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ judul: "", isi: "", file: null, status: "publish" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", ok: true });

  async function fetchItems() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("berita").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { setTimeout(() => { fetchItems(); }, 0); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true); setMsg({ text: "", ok: true });

    let gambar_url = null;
    if (form.file) {
      const ext = form.file.name.split(".").pop();
      const path = `berita/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, form.file);
      if (upErr) { setMsg({ text: "Gagal upload: " + upErr.message, ok: false }); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      gambar_url = urlData.publicUrl;
    }

    if (editId) {
      const update = { judul: form.judul, isi: form.isi, status: form.status, updated_at: new Date().toISOString() };
      if (gambar_url) update.gambar_url = gambar_url;
      const { error: dbErr } = await supabase.from("berita").update(update).eq("id", editId);
      if (dbErr) { setMsg({ text: "Gagal simpan: " + dbErr.message, ok: false }); setSaving(false); return; }
      setMsg({ text: "Berita berhasil diperbarui!", ok: true });
    } else {
      const { error: dbErr } = await supabase.from("berita").insert({ judul: form.judul, isi: form.isi, gambar_url, status: form.status });
      if (dbErr) { setMsg({ text: "Gagal simpan: " + dbErr.message, ok: false }); setSaving(false); return; }
      setMsg({ text: "Berita berhasil ditambahkan!", ok: true });
    }

    setForm({ judul: "", isi: "", file: null, status: "publish" });
    setEditId(null);
    setSaving(false);
    fetchItems();
  }

  async function handleDelete(id) {
    if (!supabase) return;
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    const { error } = await supabase.from("berita").delete().eq("id", id);
    if (error) { alert("Gagal menghapus: " + error.message); return; }
    fetchItems();
  }

  async function toggleStatus(item) {
    if (!supabase) return;
    const newStatus = item.status === "publish" ? "draft" : "publish";
    await supabase.from("berita").update({ status: newStatus }).eq("id", item.id);
    fetchItems();
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm({ judul: item.judul, isi: item.isi, file: null, status: item.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inputStyle = { border: "1px solid var(--adm-border)", background: "var(--adm-input-bg)", color: "var(--adm-text)" };

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-xl p-5 mb-6"
        style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 12px var(--adm-shadow)" }}>
        <h3 className="font-bold mb-4 text-base" style={{ color: "var(--adm-text)" }}>
          {editId ? "✏️ Edit Berita" : "➕ Tambah Berita"}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Judul</label>
          <input type="text" required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Isi Berita</label>
          <textarea required value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} rows={6}
            className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Gambar Sampul (opsional)</label>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#0D2E2B] file:text-[#0E8C82] hover:file:bg-[#0E8C82] hover:file:text-white file:cursor-pointer file:transition-all cursor-pointer"
              style={{ color: "var(--adm-text-muted)" }} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        {msg.text && <p className="text-sm mb-3 font-semibold" style={{ color: msg.ok ? "var(--adm-teal)" : "#F87171" }}>{msg.text}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Simpan Berita"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ judul: "", isi: "", file: null, status: "publish" }); }} className="btn-secondary text-sm">Batal</button>}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>Belum ada berita.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
              style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", boxShadow: "0 2px 8px var(--adm-shadow)" }}>
              {item.gambar_url && <img src={item.gambar_url} alt="" className="w-full sm:w-28 h-20 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h4 className="font-bold text-sm truncate flex-1" style={{ color: "var(--adm-text)" }}>{item.judul}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                    style={{
                      background: item.status === "publish" ? "var(--adm-teal-soft)" : "var(--adm-mist)",
                      color: item.status === "publish" ? "var(--adm-teal)" : "var(--adm-text-muted)",
                    }}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: "var(--adm-text-muted)" }}>{item.isi}</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => toggleStatus(item)} className="text-xs px-3 py-1 rounded font-semibold transition-colors"
                    style={{ background: "var(--adm-mist)", color: "var(--adm-text-muted)" }}>
                    {item.status === "publish" ? "Ke Draft" : "Publish"}
                  </button>
                  <button onClick={() => startEdit(item)} className="text-xs px-3 py-1 rounded font-semibold"
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
