import {
  Request,
  Response,
  NextFunction,
} from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    "statusCode" in err && typeof err.statusCode === "number"
      ? err.statusCode
      : res.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
  });
};
