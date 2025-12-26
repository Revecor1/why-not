"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Stats = {
  usersCount: number;
  ordersCount: number;
  newOrdersCount: number;
  lastOrders: any[];
};

export default function AdminPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setData(await api<Stats>("/admin/stats"));
    } catch (e: any) {
      setError(e.message || "Forbidden");
      setData(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Админ</h1>
        <p className="mt-2 text-white/70">Защищенная область для ролей АДМИНИСТРАТОРА/МЕНЕДЖЕРА.</p>
      </div>

      {error && (
        <div className="card rounded-2xl p-6">
          <div className="text-white/80">Ошибка доступа: {error}</div>
          <div className="mt-2 text-sm text-white/60">Войдите под именем admin@test.com для просмотра статистики.</div>
        </div>
      )}

      {data && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card rounded-2xl p-5">
            <div className="text-sm text-white/60">Пользователи</div>
            <div className="mt-1 text-2xl font-semibold">{data.usersCount}</div>
          </div>
          <div className="card rounded-2xl p-5">
            <div className="text-sm text-white/60">Заказы</div>
            <div className="mt-1 text-2xl font-semibold">{data.ordersCount}</div>
          </div>
          <div className="card rounded-2xl p-5">
            <div className="text-sm text-white/60">Новые заказы</div>
            <div className="mt-1 text-2xl font-semibold">{data.newOrdersCount}</div>
            <div className="card rounded-2xl p-6">
            <div className="text-lg font-semibold">Управление</div>
            <div className="mt-3 flex flex-wrap gap-2"><a className="btn rounded-xl px-4 py-2 text-sm hover:bg-white/15" href="/admin/orders">Заказы</a>
    {/* позже добавим Products/News CRUD */}
  </div>
</div>

          </div>
        </div>
      )}
    </div>
  );
}
