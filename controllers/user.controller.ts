import bcrypt from "bcrypt";
import { type Request, type Response } from "express";
import { db } from "../src/prisma/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "1111";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await db.orm.public.User.where({ email }).first();

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .json({ message: "Successfully Login", user: userWithoutPassword, token });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await db.orm.public.User.all();

  const user = users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.status(200).json(user);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await db.orm.public.User.where({ id }).first();

  if (user === null) {
    // console.log("--- Station 1: Controller is throwing the error ---");
    throw new AppError("User not Found From AppError Constructor", 404);
  }

  res.status(200).json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, age, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.orm.public.User.create({
    name,
    age,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json(userWithoutPassword);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, age, email } = req.body;
  const id = Number(req.params.id);

  const user = await db.orm.public.User.where({ id }).first();

  if (user === null) {
    return res.status(404).json({ message: "user not found" });
  }

  const updatedUser = await db.orm.public.User.where({ id: id }).update({
    ...(name !== undefined && { name }),
    ...(age !== undefined && { age }),
    ...(email != undefined && { email }),
  });

  res.status(200).json(updatedUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await db.orm.public.User.where({ id }).first();

  if (user === null) {
    return res.status(404).json({ message: "user not found" });
  }

  await db.orm.public.User.where({ id }).delete();

  res.status(204).send();
});
