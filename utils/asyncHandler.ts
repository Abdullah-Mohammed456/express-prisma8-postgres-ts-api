import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";

export const asyncHandler = (controller: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch((err) => {
      // console.log(
      //   "--- Station 2: asyncHandler caught the error and is calling next(err) ---",
      // );
      next(err);
    });
  };
};
