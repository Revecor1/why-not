"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type MyOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    qty: number;
    price: number;
    product: { title: string; category: string };
  }>;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setOrders(await api<MyOrder[]>("/orders/my"));
    } catch (e: any) {
      setError(e.message || "Error");
      setOrders([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">My orders</h1>
        <p className="mt-2 text-white/70">History of your orders.</p>
      </div>

      {error && (
        <div className="card rounded-2xl p-6">
          <div className="text-white/80">Error: {error}</div>
          <div className="mt-2 text-sm text-white/60">
            Please <Link className="underline" href="/account">login</Link> to view your orders.
          </div>
        </div>
      )}

      {orders.map((o) => (
        <div key={o.id} className="card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">Order</div>
              <div className="mt-1 font-mono text-sm text-white/70">{o.id}</div>
              <div className="mt-1 text-sm text-white/60">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="rounded-full bg-white/10 px-3 py-1 text-sm">{o.status}</div>
              <div className="mt-2 text-xl font-semibold">{(o.total / 100).toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {o.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between border-t border-white/10 pt-2 text-sm">
                <div className="text-white/80">
                  {it.product.title} <span className="text-white/50">({it.product.category})</span>
                </div>
                <div className="text-white/70">
                  x{it.qty} · {(it.price / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!error && orders.length === 0 && (
        <div className="card rounded-2xl p-6 text-white/70">
          No orders yet. Go to <Link className="underline" href="/cart">Cart</Link>.
        </div>
      )}
    </div>
  );
}
