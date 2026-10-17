import { Router } from "express";
import { getStats, listUsers, sendBroadcast, updateUserRole } from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/stats", getStats);
router.post("/broadcast", sendBroadcast);

export default router;
