/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import AdminGalleryManager from "../../components/AdminGalleryManager";
import AdminNewsManager from "../../components/AdminNewsManager";
import AdminHeroManager from "../../components/AdminHeroManager";
import AdminAboutManager from "../../components/AdminAboutManager";
import AdminContactManager from "../../components/AdminContactManager";
import AdminHome from "../../components/AdminHome";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("beranda");
  const [isDark, setIsDark] = useState(true); // default dark
  const [adminAvatar, setAdminAvatar] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        router.push("/ad22ae3762ff4bd9af5fad5ab1709e83d457f75f224b1a509afd0440c52da0a6e7f90d4091ff575184ed1919864024dc4eb9965088d8e1bf728aec0584b84ba6");
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/ad22ae3762ff4bd9af5fad5ab1709e83d457f75f224b1a509afd0440c52da0a6e7f90d4091ff575184ed1919864024dc4eb9965088d8e1bf728aec0584b84ba6");
        return;
      }
      setUser(session.user);
      
      // Fetch avatar
      const { data: avatarData } = await supabase.from("admin_avatar").select("*").order("updated_at", { ascending: false }).limit(1);
      if (avatarData && avatarData.length > 0) {
        setAdminAvatar(avatarData[0]);
      }
      
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut();
    router.push("/ad22ae3762ff4bd9af5fad5ab1709e83d457f75f224b1a509afd0440c52da0a6e7f90d4091ff575184ed1919864024dc4eb9965088d8e1bf728aec0584b84ba6");
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file || !supabase) return;

    setUploadingAvatar(true);
    
    const ext = file.name.split(".").pop();
    const path = `admin_avatar/${Date.now()}.${ext}`;
    
    // Upload image
    const { error: upErr } = await supabase.storage.from("media").upload(path, file);
    if (upErr) {
      alert("Gagal mengunggah foto profil: " + upErr.message);
      setUploadingAvatar(false);
      return;
    }

    // Get URL
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    const image_url = urlData.publicUrl;

    // Save to DB
    if (adminAvatar) {
      const { error } = await supabase.from("admin_avatar").update({ image_url, updated_at: new Date().toISOString() }).eq("id", adminAvatar.id);
      if (error) alert("Gagal menyimpan foto profil: " + error.message);
    } else {
      const { error } = await supabase.from("admin_avatar").insert({ image_url });
      if (error) alert("Gagal menyimpan foto profil: " + error.message);
    }

    // Refresh avatar
    const { data: newAvatar } = await supabase.from("admin_avatar").select("*").order("updated_at", { ascending: false }).limit(1);
    if (newAvatar && newAvatar.length > 0) setAdminAvatar(newAvatar[0]);
    
    setUploadingAvatar(false);
  }

  if (loading) {
    return (
      <div
        id="admin-panel-root"
        className={`min-h-screen flex items-center justify-center${isDark ? " admin-dark" : ""}`}
      >
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--adm-border)",
            borderTopColor: "var(--adm-teal)",
          }}
        />
      </div>
    );
  }

  const TABS = [
    { key: "beranda", label: "🏠 Beranda", id: "tab-beranda" },
    { key: "galeri", label: "📷 Galeri", id: "tab-galeri" },
    { key: "berita", label: "📰 Berita", id: "tab-berita" },
    { key: "pesan", label: "✉️ Pesan Kontak", id: "tab-pesan" },
    { key: "hero", label: "🖼️ Hero Slider", id: "tab-hero" },
    { key: "about", label: "👤 Foto Tentang", id: "tab-about" },
  ];

  return (
    <div id="admin-panel-root" className={isDark ? "admin-dark" : ""}>
      <title>Dashboard Admin — Biddokkes</title>

      {/* ── Top Bar ─────────────────────────── */}
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{
          background: "var(--adm-header)",
          borderBottom: "2px solid var(--adm-gold)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => document.getElementById("avatar-upload-input").click()}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden cursor-pointer group"
              style={{ background: "var(--adm-gold)", color: "#0B2340", border: "2px solid var(--adm-gold)" }}
              title="Klik untuk mengganti foto profil"
            >
              <img 
                src={adminAvatar?.image_url || "https://ui-avatars.com/api/?name=Admin&background=D9A441&color=0B2340&bold=true"} 
                alt="Admin Profile" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                {uploadingAvatar ? (
                   <span className="text-[10px] text-white">...</span>
                ) : (
                   <span className="text-[10px] text-white">Ubah</span>
                )}
              </div>
            </div>
            <input 
              type="file" 
              id="avatar-upload-input" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F1F5F9" }}
            >
              Admin Panel
            </span>
            <span
              className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(14,140,130,0.25)", color: "#0E8C82" }}
            >
              BIDDOKKES POLDA SULTENG
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs opacity-50 hidden sm:block"
              style={{ color: "#F1F5F9" }}
            >
              {user?.email}
            </span>

            {/* Dark / Light toggle */}
            <button
              onClick={() => setIsDark((d) => !d)}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.2)",
                color: "#F1F5F9",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {isDark ? "☀️ Terang" : "🌙 Gelap"}
            </button>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded font-semibold transition-all hover:opacity-80"
              style={{
                background: "rgba(220,38,38,0.2)",
                color: "#FCA5A5",
                border: "1px solid rgba(220,38,38,0.3)",
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ── Tab Bar ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div
          className="flex flex-wrap gap-2 p-1.5 rounded-xl mb-6 shadow-inner"
          style={{
            background: "var(--adm-surface2)",
            border: "1px solid var(--adm-border)",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              id={t.id}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={
                tab === t.key
                  ? {
                      background: "var(--adm-teal)",
                      color: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(14,140,130,0.35)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--adm-text-muted)",
                    }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ─────────────────────────── */}
        <div className="pb-32 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "beranda" && <AdminHome setTab={setTab} isDark={isDark} />}
              {tab === "galeri" && <AdminGalleryManager />}
              {tab === "berita" && <AdminNewsManager />}
              {tab === "pesan" && <AdminContactManager />}
              {tab === "hero" && <AdminHeroManager />}
              {tab === "about" && <AdminAboutManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
