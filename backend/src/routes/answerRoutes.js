import { Router } from "express";
import { listAnswers, upsertAnswer } from "../controllers/answerController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listAnswers);
router.post("/", upsertAnswer);

export default router;
