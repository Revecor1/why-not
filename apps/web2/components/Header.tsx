"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Меню" },
  { href: "/news", label: "новости" },
  { href: "/cart", label: "Корзина" },
  { href: "/orders", label: "Мои заказы" },
  { href: "/account", label: "Аккаунт" },
  { href: "/admin", label: "Админ" },
];


export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-wide">
          Why Not
          <span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-xs text-white/70">coffee</span>
        </Link>

        <nav className="flex gap-1">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={[
                  "rounded-full px-3 py-2 text-sm transition",
                  active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
