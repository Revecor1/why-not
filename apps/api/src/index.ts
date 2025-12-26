import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";
import newsRoutes from "./routes/news";
import ordersRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/news", newsRoutes);
app.use("/orders", ordersRoutes);
app.use("/admin", adminRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API: http://localhost:${port}`));
