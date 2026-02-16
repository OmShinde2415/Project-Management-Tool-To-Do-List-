import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

const ensureProjectMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((memberId) => memberId.toString() === userId);
  const isOwner = project.owner.toString() === userId;

  if (!isMember && !isOwner) {
    throw new AppError("Access denied: not a project member", 403);
  }

  return project;
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const { title, description, status, project, assignedTo } = req.body;

    if (!title || !project) {
      return next(new AppError("Title and project are required", 400));
    }

    await ensureProjectMember(project, userId);

    const task = await Task.create({
      title,
      description,
      status,
      project,
      assignedTo
    });

    const populatedTask = await task.populate([
      { path: "project", select: "title" },
      { path: "assignedTo", select: "name email avatar" }
    ]);

    return res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    return next(error);
  }
};

export const getTasksByProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const { projectId } = req.params;
    await ensureProjectMember(projectId, userId);

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    await ensureProjectMember(task.project.toString(), userId);

    const { title, description, status, assignedTo } = req.body;

    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo;
    }

    await task.save();

    const populatedTask = await task.populate([
      { path: "project", select: "title" },
      { path: "assignedTo", select: "name email avatar" }
    ]);

    return res.status(200).json({ success: true, task: populatedTask });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    await ensureProjectMember(task.project.toString(), userId);

    await Task.findByIdAndDelete(task._id);

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};
