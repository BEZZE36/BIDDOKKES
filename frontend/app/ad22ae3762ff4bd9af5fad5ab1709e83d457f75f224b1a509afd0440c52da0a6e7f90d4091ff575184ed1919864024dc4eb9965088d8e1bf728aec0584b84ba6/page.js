/* eslint-disable @next/next/no-img-element */
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

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0B2340 0%, #1a3a5c 100%)",
      }}
    >
      <title>Admin Login — Biddokkes Polda Sulteng</title>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <img
              src="https://storage.pusdokkes.polri.go.id/pusdokkes/logo.png"
              alt="Logo Pusdokkes"
              className="w-full h-full object-contain"
            />
          </div>
          <h2
            className="text-[#ffffff] text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Panel Admin
          </h2>
          <p className="text-sm mt-1 text-[#ffffff]/60">
            Biddokkes Polda Sulawesi Tengah
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl p-6 shadow-xl bg-[#ffffff]"
        >
          <div className="mb-4">
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold mb-1 text-ink-900"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#f8fafc]! text-[#0f172a]! border! border-line! focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="admin@email.com"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold mb-1 text-ink-900"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#f8fafc]! text-[#0f172a]! border! border-line! focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              id="admin-login-error"
              className="text-sm mb-4 p-3 rounded-lg bg-[#FEF2F2] text-[#DC2626]"
            >
              {error}
            </p>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
            style={{ background: loading ? "#5C6B72" : "#0E8C82" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-[#ffffff]/40">
          Hanya untuk administrator Biddokkes yang terdaftar.
        </p>
      </div>
    </div>
  );
}
