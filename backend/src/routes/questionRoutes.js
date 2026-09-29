import { Router } from "express";
import { listQuestions, nextQuestion } from "../controllers/questionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listQuestions);
router.post("/next", nextQuestion);

export default router;
