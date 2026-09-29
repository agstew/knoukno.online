import { Router } from "express";
import { gradeAnswer, listAnswers, rankAnswer, upsertAnswer } from "../controllers/answerController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listAnswers);
router.post("/", upsertAnswer);
router.patch("/:id/grade", gradeAnswer);
router.patch("/:id/rank", rankAnswer);

export default router;
