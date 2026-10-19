import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import averageRoutes from "./routes/averageRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import rateRoutes from "./routes/rateRoutes.js";
import titleRoutes from "./routes/titleRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Railway (and most PaaS hosts) sit behind a reverse proxy that sets X-Forwarded-For;
// without this, express-rate-limit can't safely key by IP.
app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // The PayPal SDK requires one known inline bootstrap script - allow it by
        // hash (not 'unsafe-inline', which would permit any inline script to run).
        "script-src": [
          "'self'",
          "https://www.paypal.com",
          "https://www.paypalobjects.com",
          "'sha256-n8SeBQJ44hfg74TlDOKj4U2ORkgMfIj5ms8CC25yEBk='",
        ],
        "connect-src": ["'self'", "https://www.paypal.com", "https://www.paypalobjects.com"],
        "frame-src": ["https://www.paypal.com", "https://www.sandbox.paypal.com"],
        "img-src": ["'self'", "data:", "https://www.paypalobjects.com"],
      },
    },
  })
);
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
app.use("/api/titles", titleRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/averages", averageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/plans", priceRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Serve the built frontend when bundled alongside the API (combined single-service deploy)
const publicDir = path.join(__dirname, "..", "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

export default app;
