"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type AdminOrder = {
  id: string;
  status: "NEW" | "IN_PROGRESS" | "DONE" | "CANCELED";
  total: number;
  createdAt: string;
  user: { email: string };
  items: Array<{ id: string; qty: number; product: { title: string } }>;
};

const STATUSES: AdminOrder["status"][] = ["NEW", "IN_PROGRESS", "DONE", "CANCELED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setOrders(await api<AdminOrder[]>("/admin/orders"));
    } catch (e: any) {
      setError(e.message || "Forbidden");
      setOrders([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: AdminOrder["status"]) {
    const prev = orders;
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));

    try {
      await api(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (e: any) {
      setOrders(prev);
      setError(e.message || "Error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Админ · заказы</h1>
          <Link className="text-sm text-white/70 underline" href="/admin">
           Вернуться к администратору
          </Link>
        </div>
        <p className="mt-2 text-white/70">Управляйте статусами заказов.</p>
      </div>

      {error && (
        <div className="card rounded-2xl p-6">
          <div className="text-white/80">Ошибка: {error}</div>
          <div className="mt-2 text-sm text-white/60">
            Авторизуйтесь под <Link className="underline" href="/account">admin@test.com</Link>.
          </div>
        </div>
      )}

      {!error && (
        <div className="card rounded-2xl p-6">
          {orders.length === 0 ? (
            <div className="text-white/70">Нету заказов</div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-sm text-white/70">{o.id}</div>
                      <div className="mt-1 text-sm text-white/60">
                        {new Date(o.createdAt).toLocaleString()} · {o.user.email} · {o.items.length} items
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-white/70">{(o.total / 100).toFixed(2)}</div>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value as AdminOrder["status"])}
                        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/70">
                    {o.items.map((it) => `${it.product.title} x${it.qty}`).join(" · ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
