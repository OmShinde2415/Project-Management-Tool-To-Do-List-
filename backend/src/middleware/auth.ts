import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
      };
    }
  }
}

interface JwtPayload {
  id: string;
}

const extractToken = (req: Request) => {
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(new AppError("Unauthorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id).select("name email avatar");

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };

    return next();
  } catch (_error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
