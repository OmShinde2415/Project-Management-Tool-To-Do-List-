import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, taskId } = req.body;

    if (!content || !taskId) {
      return next(new AppError("Content and taskId are required", 400));
    }

    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    // Check if user is member of project
    const isMember =
      project.owner.toString() === userId ||
      project.members.some((member) => member.toString() === userId);

    if (!isMember) {
      return next(new AppError("Forbidden", 403));
    }

    const comment = await Comment.create({
      content,
      task: taskId,
      author: userId,
    });

    const populatedComment = await comment.populate(
      "author",
      "name email avatar"
    );

    return res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCommentsByTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;

    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.some((member) => member.toString() === userId);

    if (!isMember) {
      return next(new AppError("Forbidden", 403));
    }

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return next(error);
  }
};