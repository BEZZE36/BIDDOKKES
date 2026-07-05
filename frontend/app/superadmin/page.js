"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    is_maintenance_public: false,
    is_maintenance_admin: false,
    judul_maintenance_public: "",
    judul_maintenance_admin: "",
    deskripsi_maintenance_public: "",
    deskripsi_maintenance_admin: "",
    waktu_selesai_public: "",
    waktu_selesai_admin: "",
    pin_superadmin: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    if (!supabase) return;
    const { data } = await supabase.from("pengaturan_sistem").select("*").eq("id", 1).single();
    if (data) {
      setFormData({
        is_maintenance_public: data.is_maintenance_public || false,
        is_maintenance_admin: data.is_maintenance_admin || false,
        judul_maintenance_public: data.judul_maintenance_public || "",
        judul_maintenance_admin: data.judul_maintenance_admin || "",
        deskripsi_maintenance_public: data.deskripsi_maintenance_public || "",
        deskripsi_maintenance_admin: data.deskripsi_maintenance_admin || "",
        waktu_selesai_public: data.waktu_selesai_public ? new Date(data.waktu_selesai_public).toISOString().slice(0, 16) : "",
        waktu_selesai_admin: data.waktu_selesai_admin ? new Date(data.waktu_selesai_admin).toISOString().slice(0, 16) : "",
        pin_superadmin: data.pin_superadmin
      });
    }
    setLoading(false);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pinInput === formData.pin_superadmin) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("PIN salah! Akses ditolak.");
    }
  }

  function getDefaultDateTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 16);
  }

  async function handleInstantToggle(type, value) {
    const updatedFormData = { ...formData, [type]: value };

    if (value === true) {
      if (type === "is_maintenance_public" && !updatedFormData.waktu_selesai_public) {
        updatedFormData.waktu_selesai_public = getDefaultDateTime();
      }
      if (type === "is_maintenance_admin" && !updatedFormData.waktu_selesai_admin) {
        updatedFormData.waktu_selesai_admin = getDefaultDateTime();
      }
    }

    setFormData(updatedFormData);

    if (value === false) {
      // Jika toggle dimatikan (false), langsung simpan ke server (Instan)
      const isAnyActive = updatedFormData.is_maintenance_public || updatedFormData.is_maintenance_admin;
      const updatePayload = {
        [type]: false,
        waktu_mulai: isAnyActive ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("pengaturan_sistem").update(updatePayload).eq("id", 1);
      if (error) {
        setErrorMsg("Gagal mematikan mode: " + error.message);
        setTimeout(() => setErrorMsg(""), 5000);
      } else {
        setSuccessMsg(`Status ${type === 'is_maintenance_public' ? 'Publik' : 'Admin'} DIBUKA!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } else {
      // Jika toggle dihidupkan (true), hanya ubah state. Wajib tekan tombol Terapkan.
      setSuccessMsg(`Sakelar dinyalakan. Tekan "Terapkan ke Server" untuk mengaktifkan.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  async function handleBukaAksesLangsung() {
    setFormData({ ...formData, is_maintenance_public: false, is_maintenance_admin: false, waktu_selesai_public: "", waktu_selesai_admin: "" });
    const updatePayload = {
      is_maintenance_public: false,
      is_maintenance_admin: false,
      waktu_selesai_public: null,
      waktu_selesai_admin: null,
      waktu_mulai: null,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from("pengaturan_sistem").update(updatePayload).eq("id", 1);
    if (!error) {
      setSuccessMsg("Semua akses berhasil DIBUKA secara instan!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const isAnyActive = formData.is_maintenance_public || formData.is_maintenance_admin;

    const updateData = {
      is_maintenance_public: formData.is_maintenance_public,
      is_maintenance_admin: formData.is_maintenance_admin,
      judul_maintenance_public: formData.judul_maintenance_public,
      judul_maintenance_admin: formData.judul_maintenance_admin,
      deskripsi_maintenance_public: formData.deskripsi_maintenance_public,
      deskripsi_maintenance_admin: formData.deskripsi_maintenance_admin,
      waktu_mulai: isAnyActive ? new Date().toISOString() : null,
      waktu_selesai_public: formData.waktu_selesai_public ? new Date(formData.waktu_selesai_public).toISOString() : null,
      waktu_selesai_admin: formData.waktu_selesai_admin ? new Date(formData.waktu_selesai_admin).toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from("pengaturan_sistem").update(updateData).eq("id", 1);
    
    if (error) {
      setErrorMsg("Gagal menyimpan pengaturan: " + error.message);
      setTimeout(() => setErrorMsg(""), 5000);
    } else {
      setSuccessMsg("Pengaturan berhasil disimpan! Perubahan langsung aktif di seluruh website.");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    setLoading(false);
  }

  if (loading && !formData.pin_superadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-slate-900 p-8 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-[#FFFFFF] mb-2 font-mono">Super Admin</h1>
          <p className="text-slate-400 text-sm mb-6 font-mono">Masukkan PIN Master untuk mengakses Mode Pemeliharaan Sistem Biddokkes.</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="PIN Rahasia..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-center text-xl text-[#FFFFFF] py-3 rounded-lg focus:outline-none focus:border-teal-500 mb-4 tracking-widest font-mono"
              autoFocus
            />
            {errorMsg && <p className="text-red-400 text-xs mb-4 font-mono">{errorMsg}</p>}
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-[#FFFFFF] font-bold py-3 rounded-lg transition-colors font-mono">
              Buka Kunci
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const isAnyActive = formData.is_maintenance_public || formData.is_maintenance_admin;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 font-mono relative">
      {/* Toast Notifications */}
      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 right-8 z-[100] p-4 bg-teal-500 border border-teal-400 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] text-black font-bold flex items-center gap-3 max-w-sm"
        >
          <span>✅</span>
          <p>{successMsg}</p>
        </motion.div>
      )}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 right-8 z-[100] p-4 bg-red-600 border border-red-500 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white font-bold flex items-center gap-3 max-w-sm"
        >
          <span>⚠️</span>
          <p>{errorMsg}</p>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FFFFFF] flex items-center gap-3">
              <span>🛡️</span> Control Panel Super Admin
            </h1>
            <p className="text-slate-400 mt-2">Pusat komando darurat dan pemeliharaan website.</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-sm transition-colors border border-slate-800"
          >
            Kunci & Keluar
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden"
        >
          {/* Cyber Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />

          {((formData.is_maintenance_public && formData.waktu_selesai_public && new Date(formData.waktu_selesai_public).getTime() < new Date().getTime()) || 
            (formData.is_maintenance_admin && formData.waktu_selesai_admin && new Date(formData.waktu_selesai_admin).getTime() < new Date().getTime())) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-red-900/40 border-2 border-red-500 rounded-xl relative z-10"
            >
              <h2 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                <span className="animate-ping">🚨</span> PERINGATAN: BATAS WAKTU TERCAPAI
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                Waktu target pada area yang dikunci telah berlalu. Silakan tekan tombol di bawah untuk membuka semua akses yang terkunci dan mengembalikan situs ke normal.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBukaAksesLangsung}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-[#FFFFFF] font-bold py-2 px-4 rounded-lg transition-colors border border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.5)]"
                >
                  🟢 Buka Akses Sekarang
                </button>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSave} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toggle Public */}
              <div className="flex flex-col p-5 rounded-xl border-2 transition-colors" style={{ borderColor: formData.is_maintenance_public ? "#0E8C82" : "#1E293B", background: formData.is_maintenance_public ? "rgba(14,140,130,0.05)" : "transparent" }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${formData.is_maintenance_public ? "text-teal-400" : "text-[#FFFFFF]"}`}>
                    Blokir Publik (Beranda)
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.is_maintenance_public}
                      onChange={(e) => handleInstantToggle("is_maintenance_public", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFFFFF] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
                <p className="text-xs opacity-70 mb-4">
                  Pengunjung publik tidak bisa melihat halaman utama, berita, dan galeri.
                </p>
                {formData.is_maintenance_public && (
                  <div className="mt-2 pt-4 border-t border-slate-700/50">
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Target Selesai Publik</label>
                    <input
                      type="datetime-local"
                      value={formData.waktu_selesai_public}
                      onChange={(e) => setFormData({ ...formData, waktu_selesai_public: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-[#FFFFFF] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-teal-500 [color-scheme:dark]"
                    />
                  </div>
                )}
              </div>

              {/* Toggle Admin */}
              <div className="flex flex-col p-5 rounded-xl border-2 transition-colors" style={{ borderColor: formData.is_maintenance_admin ? "#0E8C82" : "#1E293B", background: formData.is_maintenance_admin ? "rgba(14,140,130,0.05)" : "transparent" }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${formData.is_maintenance_admin ? "text-teal-400" : "text-[#FFFFFF]"}`}>
                    Blokir Akses Admin
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.is_maintenance_admin}
                      onChange={(e) => handleInstantToggle("is_maintenance_admin", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#FFFFFF] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
                <p className="text-xs opacity-70 mb-4">
                  Admin tidak bisa login dan melihat dashboard pengelolaan data.
                </p>
                {formData.is_maintenance_admin && (
                  <div className="mt-2 pt-4 border-t border-slate-700/50">
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Target Selesai Admin</label>
                    <input
                      type="datetime-local"
                      value={formData.waktu_selesai_admin}
                      onChange={(e) => setFormData({ ...formData, waktu_selesai_admin: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-[#FFFFFF] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-teal-500 [color-scheme:dark]"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-6 transition-opacity duration-300 ${!isAnyActive ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teks Beranda Publik */}
                <div className="space-y-4 p-4 border border-slate-800 rounded-xl bg-slate-900/50">
                  <h4 className="font-bold text-teal-400">Teks Peringatan Publik</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Judul Peringatan</label>
                    <input
                      type="text"
                      value={formData.judul_maintenance_public}
                      onChange={(e) => setFormData({...formData, judul_maintenance_public: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 text-[#FFFFFF] px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                      placeholder="Contoh: SYSTEM LOCKDOWN"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Deskripsi Detail</label>
                    <textarea
                      rows="3"
                      value={formData.deskripsi_maintenance_public}
                      onChange={(e) => setFormData({...formData, deskripsi_maintenance_public: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 text-[#FFFFFF] px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                      placeholder="Jelaskan alasan pemeliharaan untuk publik..."
                    />
                  </div>
                </div>

                {/* Teks Dashboard Admin */}
                <div className="space-y-4 p-4 border border-slate-800 rounded-xl bg-slate-900/50">
                  <h4 className="font-bold text-red-400">Teks Peringatan Admin</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Judul Peringatan</label>
                    <input
                      type="text"
                      value={formData.judul_maintenance_admin}
                      onChange={(e) => setFormData({...formData, judul_maintenance_admin: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 text-[#FFFFFF] px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                      placeholder="Contoh: RESTRICTED AREA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Deskripsi Detail</label>
                    <textarea
                      rows="3"
                      value={formData.deskripsi_maintenance_admin}
                      onChange={(e) => setFormData({...formData, deskripsi_maintenance_admin: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 text-[#FFFFFF] px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                      placeholder="Instruksi khusus untuk administrator..."
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-[#FFFFFF] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(14,140,130,0.3)] transition-all flex justify-center items-center gap-2 text-lg"
              >
                {loading ? "Menyimpan..." : "🚀 Terapkan Pengaturan ke Server"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
