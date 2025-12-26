import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();
router.use(auth, requireRole(["ADMIN", "MANAGER"]));

router.get("/stats", async (_req, res) => {
  const [usersCount, ordersCount, newOrdersCount, lastOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } }
    })
  ]);
  res.json({ usersCount, ordersCount, newOrdersCount, lastOrders });
});

router.get("/users", requireRole(["ADMIN"]), async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
  res.json(users);
});

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().min(0),
  category: z.string().min(1),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional()
});

router.post("/products", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
  res.json(await prisma.product.create({ data: parsed.data }));
});

router.patch("/products/:id", async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
  res.json(await prisma.product.update({ where: { id: req.params.id }, data: parsed.data }));
});

router.delete("/products/:id", requireRole(["ADMIN"]), async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const newsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  isPublished: z.boolean().optional()
});

router.post("/news", async (req, res) => {
  const parsed = newsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });
  res.json(await prisma.news.create({
    data: { ...parsed.data, publishedAt: parsed.data.isPublished ? new Date() : null }
  }));
});

router.patch("/news/:id", async (req, res) => {
  const parsed = newsSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const data: any = { ...parsed.data };
  if (typeof data.isPublished === "boolean") data.publishedAt = data.isPublished ? new Date() : null;

  res.json(await prisma.news.update({ where: { id: req.params.id }, data }));
});

router.delete("/news/:id", requireRole(["ADMIN"]), async (req, res) => {
  await prisma.news.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } }, items: { include: { product: true } } }
  });
  res.json(orders);
});

router.patch("/orders/:id/status", async (req, res) => {
  const schema = z.object({ status: z.enum(["NEW", "IN_PROGRESS", "DONE", "CANCELED"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  res.json(await prisma.order.update({ where: { id: req.params.id }, data: { status: parsed.data.status } }));
});

export default router;
