import { Router } from "express";
import { createBusiness, getBusiness, listBusinesses } from "../controllers/businessController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listBusinesses);
router.post("/", createBusiness);
router.get("/:id", getBusiness);

export default router;
