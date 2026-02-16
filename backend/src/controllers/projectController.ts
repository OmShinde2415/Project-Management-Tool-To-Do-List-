import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { AppError } from "../middleware/errorHandler";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, members = [] } = req.body;

    if (!title) {
      return next(new AppError("Project title is required", 400));
    }

    const ownerId = req.user?._id;
    if (!ownerId) {
      return next(new AppError("Unauthorized", 401));
    }

    const memberIds = Array.isArray(members) ? members.map(String) : [];
    if (!memberIds.includes(ownerId)) {
      memberIds.push(ownerId);
    }

    const project = await Project.create({
      title,
      description,
      owner: ownerId,
      members: memberIds
    });

    const populatedProject = await project.populate([
      { path: "owner", select: "name email avatar" },
      { path: "members", select: "name email avatar" }
    ]);

    return res.status(201).json({ success: true, project: populatedProject });
  } catch (error) {
    return next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const projectId = req.params.id;

    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    if (project.owner.toString() !== userId) {
      return next(new AppError("Only project owner can delete this project", 403));
    }

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    return next(error);
  }
};
