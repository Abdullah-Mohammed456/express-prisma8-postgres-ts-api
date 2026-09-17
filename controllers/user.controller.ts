import bcrypt from "bcrypt";
import { type Request, type Response } from "express";
import { db } from "../src/prisma/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { queryRaw } from "../src/prisma/raw.database.js";
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
    expiresIn: "7d",
  });

  res
    .status(200)
    .json({ message: "Successfully Login", user: userWithoutPassword, token });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  let page = Number(req.query.page);
  let limit = Number(req.query.limit);
  let { sortBy, order } = req.query;

  const isAscending = order === "asc"; // bro we forgot this line to check asc as a default
  const age = Number(req.query.age);
  const q = req.query.q;

  if (!page) page = 1;
  if (!limit) limit = 10;

  const skip = (page - 1) * limit;

  console.log(
    `number of page is ${page}, number of limit is ${limit}, and skip is ${skip}`,
  );

  let query = db.orm.public.User;

  // I supposed there is no one has age 0 so all numbers will fit the condition
  // this is the DRY way and most complicated
  // const users = age
  //   ? await db.orm.public.User.orderBy((row) => {
  //       return order
  //         ? row[sortBy as keyof typeof row].asc()
  //         : row[sortBy as keyof typeof row].desc();
  //     })
  //       .where({ age })
  //       .offset(skip)
  //       .limit(limit)
  //       .all()
  //   : await db.orm.public.User.orderBy((row) => {
  //       return order
  //         ? row[sortBy as keyof typeof row].asc()
  //         : row[sortBy as keyof typeof row].desc();
  //     })
  //       .offset(skip)
  //       .limit(limit)
  //       .all();

  // the simplify way

  if (!isNaN(age)) {
    query = query.where({ age });
  }

  if (typeof q === "string") {
    query = query.where({
      name: q, // break point here to return back soon to change it to be partial search like contains %${q}% in SQL
    });
  }

  if (typeof sortBy === "string") {
    query = query.orderBy((u: any) => {
      return isAscending ? u[sortBy].asc() : u[sortBy].desc();
    });
  }

  const users = await query.offset(skip).limit(limit).all();

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

// DATABASE TEST WRITING A QUERY MANUALLY WITHOUT NEED TO PRISMA 8

export const getRawUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await queryRaw('select name,id,email,role from "user";');
  res
    .status(200)
    .json({ success: true, count: result.rowCount, users: result.rows });
});

export const getRawUsersWithPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const query = `select u.name,coalesce(json_agg(json_build_object('title',u_p.title))filter(where u_p.title is not null),'[]') as posts
                    from "user" u
                    left join "user_posts" u_p on u.id = u_p.author_id
                    group by u.id,u.name;`;
    const result = await queryRaw(query);

    res
      .status(200)
      .json({ success: true, count: result.rowCount, users: result.rows });
  },
);

// DATABASE TEST WRITING A QUERY IN PRISMA 8 ORM

export const getRawUsersWithPostsORM = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await db.orm.public.User.include("user_posts").all();
    const sanitizedUsers = users.map((user) => ({
      name: user.name,
      posts: user.user_posts.map((post) => ({
        title: post.title,
      })),
    }));

    res.status(200).json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  },
);
