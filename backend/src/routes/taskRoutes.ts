import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createTask, deleteTask, getTasksByProject, updateTask } from "../controllers/taskController";

const router = Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
