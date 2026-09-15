import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

declare global {
  interface Error {
    sqlState?: string;
  }
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log("--- Station 3: errorMiddleware received the error ---");
  // console.log("======Debug Error Object======\n", err);
  console.error(err.stack);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, statusCode: err.statusCode });
  }

  if (err.sqlState === "23505") {
    return res.status(400).json({
      message: "Email already exists. Please use a different email.",
      statusCode: 400,
    });
  }
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
};
