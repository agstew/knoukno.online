import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitContact } from "../controllers/contactController.js";

const router = Router();

// Skipped in tests, which legitimately hammer these routes in a single run.
const contactLimiter =
  process.env.NODE_ENV === "test"
    ? (_req, _res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: "Too many requests, please try again later." },
      });

router.post("/", contactLimiter, submitContact);

export default router;
