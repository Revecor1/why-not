import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export type AuthedRequest = Request & { user?: { id: string; role: string } };

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
