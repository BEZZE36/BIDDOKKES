"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";


export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!supabase) {
      setError("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, var(--color-navy-900) 0%, #1a3a5c 100%)" }}>
      <title>Admin Login — Biddokkes Polda Sulteng</title>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
            style={{ background: "var(--color-gold-500)", color: "var(--color-navy-900)" }}>B</div>
          <h2 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Panel Admin</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Biddokkes Polda Sulawesi Tengah</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="rounded-2xl p-6 shadow-xl" style={{ background: "var(--color-white)" }}>
          <div className="mb-4">
            <label htmlFor="admin-email" className="block text-sm font-semibold mb-1" style={{ color: "var(--color-ink-900)" }}>Email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: "1px solid var(--color-line)", outline: "none" }}
              placeholder="admin@email.com"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="admin-password" className="block text-sm font-semibold mb-1" style={{ color: "var(--color-ink-900)" }}>Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: "1px solid var(--color-line)", outline: "none" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p id="admin-login-error" className="text-sm mb-4 p-3 rounded-lg" style={{ background: "#FEF2F2", color: "#DC2626" }}>
              {error}
            </p>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
            style={{ background: loading ? "var(--color-ink-500)" : "var(--color-teal-600)" }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          Hanya untuk administrator Biddokkes yang terdaftar.
        </p>
      </div>
    </div>
  );
}
