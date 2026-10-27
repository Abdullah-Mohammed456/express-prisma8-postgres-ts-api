import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { JWT_SECRET } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Access Denied", 401);
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    throw new AppError("Invalid or Expired Token", 401);
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const Admin = req.user.role === "ADMIN";

  if (!Admin) {
    throw new AppError("Access Denied: Admins Only", 403);
  }
  next();
};
