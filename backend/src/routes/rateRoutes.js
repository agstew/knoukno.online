import { Router } from "express";
import { listRates, upsertRate } from "../controllers/rateController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listRates);
router.post("/", upsertRate);

export default router;
