import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import answerRoutes from "./routes/answerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

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

app.use(notFound);
app.use(errorHandler);

export default app;
