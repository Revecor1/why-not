import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth, AuthedRequest } from "../middleware/auth";

const router = Router();
router.use(auth);

router.get("/my", async (req: AuthedRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  res.json(orders);
});

router.post("/", async (req: AuthedRequest, res) => {
  const schema = z.object({
    items: z
      .array(z.object({ productId: z.string().min(1), qty: z.number().int().min(1).max(50) }))
      .min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  // 1) склеим дубликаты productId
  const merged = new Map<string, number>();
  for (const it of parsed.data.items) {
    merged.set(it.productId, (merged.get(it.productId) ?? 0) + it.qty);
  }
  const items = Array.from(merged, ([productId, qty]) => ({ productId, qty }));

  const ids = items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: { id: true, price: true },
  });

  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  for (const it of items) {
    if (!priceMap.has(it.productId)) {
      return res.status(400).json({ message: "Some products are not available" });
    }
  }

  const total = items.reduce((sum, it) => sum + priceMap.get(it.productId)! * it.qty, 0);

  // 2) создаём заказ
  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      total,
      items: {
        create: items.map((it) => ({
          productId: it.productId,
          qty: it.qty,
          price: priceMap.get(it.productId)!, // убрать, если поля price нет в OrderItem
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  res.json(order);
});

export default router;
