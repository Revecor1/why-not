"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Me = { id: string; email: string; role: string; createdAt: string } | null;

export default function AccountPage() {
  const [me, setMe] = useState<Me>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadMe() {
    try {
      setMe(await api<Me>("/auth/me"));
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      } else {
        await api("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
      }
      await loadMe();
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await api("/auth/logout", { method: "POST" });
      await loadMe();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Аккаунт</h1>
        <p className="mt-2 text-white/70">Auth via HttpOnly cookie.</p>

        <div className="mt-6 space-y-3 text-sm text-white/80">
          <div className="rounded-xl bg-white/5 p-4">
            <div className="font-semibold">Test users</div>
            <div className="mt-2 space-y-1 text-white/70">
              <div>admin@test.com / admin123</div>
              <div>manager@test.com / manager123</div>
              <div>user@test.com / user123</div>
            </div>
          </div>

          {me ? (
            <div className="rounded-xl bg-white/5 p-4">
              <div className="font-semibold">Вы авторизованны</div>
              <div className="mt-2 text-white/70">
                <div>Почта: {me.email}</div>
                <div>Роль: {me.role}</div>
              </div>
              <button
                onClick={logout}
                disabled={busy}
                className="btn mt-4 rounded-xl px-4 py-2 text-sm hover:bg-white/15"
              >
                Выход
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-white/5 p-4 text-white/70">Нет авторизации</div>
          )}
        </div>
      </section>

      <section className="card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mode === "login" ? "Login" : "Register"}</h2>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm text-white/70 hover:text-white"
          >
            Switch to {mode === "login" ? "Register" : "Login"}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <label className="block">
            <div className="mb-1 text-sm text-white/70">Почта</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/25"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-white/70">Пароль</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/25"
            />
          </label>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">{error}</div>}

          <button
            onClick={submit}
            disabled={busy}
            className="btn w-full rounded-xl px-4 py-2 text-sm hover:bg-white/15"
          >
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </div>
      </section>
    </div>
  );
}
