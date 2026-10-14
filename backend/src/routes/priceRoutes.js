import { Router } from "express";
import { serializePlans } from "../utils/plans.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ plans: serializePlans() });
});

export default router;
