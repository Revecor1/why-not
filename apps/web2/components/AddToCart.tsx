"use client";

import { useEffect, useState } from "react";

function readCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem("why-not-cart");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCart(cart: Record<string, number>) {
  localStorage.setItem("why-not-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:changed"));
}

export default function AddToCart({ productId }: { productId: string }) {
  const [qty, setQty] = useState(0);

  function sync() {
    const cart = readCart();
    setQty(cart[productId] || 0);
  }

  useEffect(() => {
    sync();
    const handler = () => sync();
    window.addEventListener("cart:changed", handler);
    return () => window.removeEventListener("cart:changed", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function inc() {
    const cart = readCart();
    cart[productId] = (cart[productId] || 0) + 1;
    writeCart(cart);
  }

  function dec() {
    const cart = readCart();
    const next = (cart[productId] || 0) - 1;
    if (next <= 0) delete cart[productId];
    else cart[productId] = next;
    writeCart(cart);
  }

  return (
    <div className="flex items-center gap-2">
      <button className="btn rounded-xl px-3 py-1 text-sm hover:bg-white/15" onClick={dec} disabled={qty <= 0}>
        –
      </button>
      <div className="min-w-8 text-center text-sm text-white/80">{qty}</div>
      <button className="btn rounded-xl px-3 py-1 text-sm hover:bg-white/15" onClick={inc}>
        +
      </button>
    </div>
  );
}
