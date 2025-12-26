import { api } from "@/lib/api";

type News = {
  id: string;
  title: string;
  content: string;
  publishedAt?: string | null;
};

export default async function NewsPage() {
  const news = await api<News[]>("/news");

  return (
    <div className="space-y-6">
      <div className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Новости</h1>
        <p className="mt-2 text-white/70">Нововедения и объявления</p>
      </div>

      <div className="space-y-3">
        {news.map((n) => (
          <article key={n.id} className="card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{n.title}</h2>
              <div className="text-sm text-white/60">
                {n.publishedAt ? new Date(n.publishedAt).toLocaleString() : ""}
              </div>
            </div>
            <p className="mt-3 text-white/80">{n.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
