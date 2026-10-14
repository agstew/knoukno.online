import { Router } from "express";
import { listGrades, upsertGrade } from "../controllers/gradeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listGrades);
router.post("/", upsertGrade);

export default router;
