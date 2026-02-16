import { Router } from "express";
import { createProject, deleteProject, getProjects } from "../controllers/projectController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);

export default router;
