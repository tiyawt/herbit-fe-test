"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/apiClient";

const SEEN_KEY = "herbit_onboarding_v1";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });
      const token = res?.data?.data?.token || res?.data?.token;
      if (!token) throw new Error("Token tidak ditemukan di response.");
      localStorage.setItem("access_token", token);
      await api.get("/auth/me");
      localStorage.setItem(SEEN_KEY, "1");
      router.replace("/home");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error?.details ||
        e?.message ||
        "Login gagal. Coba lagi ya.";
      setErr(msg);
      console.log("[LOGIN] error:", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-sm text-black" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            className="w-full rounded-lg bg-[#FFF3DA] p-4 text-sm outline-none mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="text-sm text-black" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className="w-full rounded-lg bg-[#FFF3DA] p-4 text-sm outline-none mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#FFD369] font-medium hover:bg-[#ffc632] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center mt-2">
          Belum punya akun?{" "}
          <a href="/register" className="font-medium text-[#FDBE45] hover:underline">Register</a>
        </p>
      </div>
    </main>
  );
}
