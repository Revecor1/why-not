import { api } from "@/lib/api";
import AddToCart from "@/components/AddToCart";
type Product = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  category: string;
  
};

export default async function Page() {
  const products = await api<Product[]>("/products");

  const byCat = products.reduce<Record<string, Product[]>>((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    
    <div className="space-y-8">
      <section className="card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Menu</h1>
        <p className="mt-2 text-white/70"></p>
      </section>

      {Object.entries(byCat).map(([cat, items]) => (
        <section key={cat} className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">{cat}</h2>
            <div className="text-sm text-white/60">{items.length} items</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((p) => (
              <div key={p.id} className="card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{p.title}</div>
                    {p.description && <div className="mt-1 text-sm text-white/70">{p.description}</div>}
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    {(p.price / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
