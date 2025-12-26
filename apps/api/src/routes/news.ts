import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" }
  });
  res.json(items);
});

export default router;
