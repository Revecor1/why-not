import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { auth, AuthedRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(4) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const { email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role: "USER" } });

  const token = signToken({ sub: user.id, role: user.role });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

  res.json({ id: user.id, email: user.email, role: user.role });
});

router.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ sub: user.id, role: user.role });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

  res.json({ id: user.id, email: user.email, role: user.role });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

router.get("/me", auth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, role: true, createdAt: true }
  });
  res.json(user);
});

export default router;
