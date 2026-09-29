import { Router } from "express";
import { PLANS } from "../utils/plans.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ plans: Object.values(PLANS) });
});

export default router;
