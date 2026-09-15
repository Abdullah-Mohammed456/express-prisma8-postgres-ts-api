import { check } from "@prisma/orm-postgres/contract-builder";
import { type Request, type Response, type NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, age, email } = req.body;

  const checkEmail = typeof email === "string" && email.includes("@");

  if (
    name === undefined ||
    age === undefined ||
    !checkEmail ||
    typeof name !== "string" ||
    typeof age !== "number" ||
    age < 18 ||
    !Number.isInteger(age) ||
    name.trim() === ""
  ) {
    return res.status(400).json({ message: "invalid user data" });
  }

  next();
};
