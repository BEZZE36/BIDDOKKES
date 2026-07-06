"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ConfirmModal from "./animations/ConfirmModal";

export default function AdminContactManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    if (!supabase) {
      setErrorMsg("Koneksi Supabase belum dikonfigurasi.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("pesan_kontak")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg("Gagal memuat data pesan.");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    setConfirmState({ open: true, id });
  }

  async function doDelete() {
    const id = confirmState.id;
    setConfirmState({ open: false, id: null });
    if (!id) return;
    setSuccessMsg("");
    setErrorMsg("");
    const { error } = await supabase.from("pesan_kontak").delete().eq("id", id);
    if (error) {
      setErrorMsg("Gagal menghapus pesan.");
    } else {
      setSuccessMsg("Pesan berhasil dihapus.");
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  }

  async function markAsRead(message) {
    if (message.sudah_dibaca) return; // Already read

    const { error } = await supabase
      .from("pesan_kontak")
      .update({ sudah_dibaca: true })
      .eq("id", message.id);

    if (!error) {
      setMessages(prev =>
        prev.map(m => (m.id === message.id ? { ...m, sudah_dibaca: true } : m))
      );
    }
  }

  return (
    <div 
      className="rounded-xl shadow-sm border overflow-hidden transition-all duration-300"
      style={{ background: "var(--adm-surface)", borderColor: "var(--adm-border)" }}
    >
      <ConfirmModal
        isOpen={confirmState.open}
        message="Yakin ingin menghapus pesan ini secara permanen?"
        onConfirm={doDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
      <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "var(--adm-border)" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--adm-text)" }}>Inbox Pesan Kontak</h2>
          <p className="text-sm mt-1" style={{ color: "var(--adm-text-muted)" }}>Kelola pesan yang masuk dari pengunjung website.</p>
        </div>
        <button
          onClick={fetchMessages}
          className="text-sm px-4 py-2 rounded-md transition-colors"
          style={{ background: "var(--adm-surface2)", color: "var(--adm-text)", border: "1px solid var(--adm-border)" }}
        >
          🔄 Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="m-6 p-4 rounded-md border" style={{ background: "rgba(220, 38, 38, 0.1)", color: "#FCA5A5", borderColor: "rgba(220, 38, 38, 0.3)" }}>
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="m-6 p-4 rounded-md border" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#6EE7B7", borderColor: "rgba(16, 185, 129, 0.3)" }}>
          ✅ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center animate-pulse" style={{ color: "var(--adm-text-muted)" }}>Memuat pesan...</div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center" style={{ color: "var(--adm-text-muted)" }}>
          <p className="text-4xl mb-3">📭</p>
          <p>Belum ada pesan yang masuk.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* List Pesan */}
          <div className="w-full md:w-1/3 border-r overflow-y-auto" style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface2)" }}>
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    markAsRead(msg);
                  }}
                  className="p-4 border-b cursor-pointer transition-colors"
                  style={{ 
                    borderColor: "var(--adm-border)",
                    background: isSelected ? "var(--adm-teal-soft)" : "transparent",
                    opacity: !msg.sudah_dibaca ? 1 : 0.6
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm truncate flex-1 pr-2 ${!msg.sudah_dibaca ? "font-bold" : ""}`} style={{ color: "var(--adm-text)" }}>
                      {!msg.sudah_dibaca && <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: "var(--adm-teal)" }}></span>}
                      {msg.nama}
                    </span>
                    <span className="text-xs whitespace-nowrap" style={{ color: "var(--adm-text-muted)" }}>
                      {new Date(msg.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="text-xs truncate mb-1" style={{ color: "var(--adm-text-muted)" }}>{msg.email}</div>
                  <div className="text-xs truncate" style={{ color: "var(--adm-text-muted)" }}>{msg.pesan}</div>
                </div>
              );
            })}
          </div>

          {/* Detail Pesan */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto" style={{ background: "var(--adm-surface)" }}>
            {selectedMessage ? (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: "var(--adm-border)" }}>
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--adm-text)" }}>{selectedMessage.nama}</h3>
                    <p className="text-sm" style={{ color: "var(--adm-text-muted)" }}>
                      Email: <a href={`mailto:${selectedMessage.email}`} className="hover:underline" style={{ color: "var(--adm-teal)" }}>{selectedMessage.email}</a>
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--adm-text-muted)" }}>
                      Dikirim pada: {new Date(selectedMessage.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-md transition-colors"
                    style={{ background: "rgba(220, 38, 38, 0.1)", color: "#EF4444" }}
                    title="Hapus Pesan"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--adm-text)" }}>
                    {selectedMessage.pesan}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--adm-border)" }}>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Balasan dari Biddokkes Polda Sulteng&body=${encodeURIComponent(
                      `Yth. Bapak/Ibu ${selectedMessage.nama},\n\nTerima kasih telah menghubungi Biddokkes Polda Sulawesi Tengah. Kami telah menerima pesan Anda dengan baik.\n\nMenanggapi pesan Anda sebelumnya:\n"${selectedMessage.pesan}"\n\n[Tuliskan balasan Anda di sini...]\n\n\nDemikian informasi yang dapat kami sampaikan. Jika ada pertanyaan lebih lanjut, silakan menghubungi kami kembali.\n\nHormat kami,\n\nAdmin Biddokkes Polda Sulteng\nhttps://biddokkes-sulteng.id`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                    style={{ background: "#EA4335", color: "#FFFFFF" }}
                  >
                    Balas via Gmail 🔴
                  </a>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Balasan dari Biddokkes Polda Sulteng`}
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                    style={{ background: "var(--adm-teal)", color: "#FFFFFF" }}
                  >
                    Aplikasi Email Lain ✉️
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">✉️</span>
                <p style={{ color: "var(--adm-text-muted)" }}>Pilih pesan di sebelah kiri untuk membaca.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
