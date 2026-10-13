import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import answerRoutes from "./routes/answerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/plans", priceRoutes);
app.use("/api/billing", billingRoutes);

// Serve the built frontend when bundled alongside the API (combined single-service deploy)
const publicDir = path.join(__dirname, "..", "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

export default app;
