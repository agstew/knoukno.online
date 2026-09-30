import { Router } from "express";
import { upgradePlan } from "../controllers/billingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.post("/upgrade", upgradePlan);

export default router;
