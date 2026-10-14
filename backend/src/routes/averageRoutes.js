import { Router } from "express";
import { getAverage } from "../controllers/averageController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getAverage);

export default router;
