import type { NextFunction, Request, Response } from "express";

export const validateID = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (id < 1 || !Number.isInteger(id)) {
    return res.status(400).json({ message: "invalid ID" });
  }

  next();
};
