import { type Request, type Response, type NextFunction } from "express";

export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, age, email } = req.body;

  const checkEmail = typeof email === "string" && email.includes("@");

  if (name === undefined && age === undefined && email === undefined) {
    return res.status(400).json({
      message: "at least one field is required",
    });
  }

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return res.status(400).json({
      message: "invalid name",
    });
  }

  if (
    age !== undefined &&
    (typeof age !== "number" || !Number.isInteger(age) || age < 18)
  ) {
    return res.status(400).json({
      message: "invalid age",
    });
  }

  if (email !== undefined && !checkEmail) {
    return res.status(400).json({ message: "invalid email" });
  }

  next();
};
