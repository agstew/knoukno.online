import { Router } from "express";
import { createTitle, deleteTitle, getTitle, listTitles } from "../controllers/titleController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listTitles);
router.post("/", createTitle);
router.get("/:id", getTitle);
router.delete("/:id", deleteTitle);

export default router;
