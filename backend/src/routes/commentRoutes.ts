import { Router } from "express";
import { createComment, getCommentsByTask } from "../controllers/commentController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", createComment);
router.get("/task/:taskId", getCommentsByTask);

export default router;