import { Router } from "express";
import { deleteUser, getStats, listUsers, sendBroadcast, updateUserRole } from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/stats", getStats);
router.post("/broadcast", sendBroadcast);

export default router;
