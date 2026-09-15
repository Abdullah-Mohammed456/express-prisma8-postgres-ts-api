import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      userID?: any;
    }
  }
}

const JWT_SECRET = "1111";

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
    req.userID = decode;

    next();
  } catch (error) {
    throw new AppError("Invalid or Expired Token", 401);
  }
};
