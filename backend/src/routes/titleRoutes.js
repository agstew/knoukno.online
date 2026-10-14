import { Router } from "express";
import { createTitle, getTitle, listTitles } from "../controllers/titleController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listTitles);
router.post("/", createTitle);
router.get("/:id", getTitle);

export default router;
