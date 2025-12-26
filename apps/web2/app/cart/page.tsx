"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
};

function readCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem("Почему нет? - корзина");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeCart(cart: Record<string, number>) {
  localStorage.setItem("Почему нет?", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:changed"));
}

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setCart(readCart());
    api<Product[]>("/products").then(setProducts).catch((e) => setError(e.message));
    const handler = () => setCart(readCart());
    window.addEventListener("cart:changed", handler);
    return () => window.removeEventListener("cart:changed", handler);
  }, []);

  const items = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return Object.entries(cart)
      .map(([productId, qty]) => {
        const p = map.get(productId);
        return p ? { product: p, qty } : null;
      })
      .filter(Boolean) as { product: Product; qty: number }[];
  }, [cart, products]);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.product.price * it.qty, 0), [items]);

  function inc(id: string) {
    const next = { ...cart, [id]: (cart[id] || 0) + 1 };
    writeCart(next);
  }
  function dec(id: string) {
    const nextQty = (cart[id] || 0) - 1;
    const next = { ...cart };
    if (nextQty <= 0) delete next[id];
    else next[id] = nextQty;
    writeCart(next);
  }
  function clear() {
    writeCart({});
  }

  async function checkout() {
    setBusy(true);
    setError(null);
    setOrder(null);

    try {
      const payload = {
        items: items.map((it) => ({ productId: it.product.id, qty: it.qty })),
      };
      const created = await api<Order>("/orders", { method: "POST", body: JSON.stringify(payload) });
      setOrder(created);
      clear();
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Корзина</h1>
        <p className="mt-2 text-white/70">Выберите товары и оформите заказ.</p>
      </div>

      {error && (
        <div className="card rounded-2xl p-6">
          <div className="text-white/80">Error: {error}</div>
          <div className="mt-2 text-sm text-white/60">
            Просим вас авторизоваться <Link className="underline" href="/account">Логин</Link>.
          </div>
        </div>
      )}

      {order && (
        <div className="card rounded-2xl p-6">
          <div className="text-lg font-semibold">Заказ создан!</div>
          <div className="mt-2 text-white/70">
            ID: <span className="font-mono">{order.id}</span>
          </div>
          <div className="mt-1 text-white/70">Статус: {order.status}</div>
        </div>
      )}

      <div className="card rounded-2xl p-6">
        {items.length === 0 ? (
          <div className="text-white/70">Корзина пуста, зайдите в <Link className="underline" href="/">Меню</Link>.</div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.product.id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <div className="font-semibold">{it.product.title}</div>
                  <div className="text-sm text-white/60">{it.product.category}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/70">{(it.product.price / 100).toFixed(2)}</div>
                  <div className="flex items-center gap-2">
                    <button className="btn rounded-xl px-3 py-1 text-sm hover:bg-white/15" onClick={() => dec(it.product.id)}>
                      –
                    </button>
                    <div className="min-w-8 text-center text-sm">{it.qty}</div>
                    <button className="btn rounded-xl px-3 py-1 text-sm hover:bg-white/15" onClick={() => inc(it.product.id)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <div className="text-white/70">Общая стоимость:</div>
              <div className="text-xl font-semibold">{(total / 100).toFixed(2)}</div>
            </div>

            <div className="flex gap-2">
              <button className="btn w-full rounded-xl px-4 py-2 text-sm hover:bg-white/15" onClick={checkout} disabled={busy}>
                {busy ? "Placing..." : "Place order"}
              </button>
              <button className="btn rounded-xl px-4 py-2 text-sm hover:bg-white/15" onClick={clear} disabled={busy}>
                Очистить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
