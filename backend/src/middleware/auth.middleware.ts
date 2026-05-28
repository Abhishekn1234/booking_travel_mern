import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/User.js";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // Set status and throw an error; asyncHandler will catch and pass to next()
    res.status(401);
    throw new Error("Unauthorized: No token provided");
  }

  // jwt.verify can throw errors (e.g., JsonWebTokenError, TokenExpiredError)
  // asyncHandler will catch these errors and pass them to next()
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    // Set status and throw an error if user is not found
    res.status(401);
    throw new Error("Unauthorized: User not found");
  }

  req.user = user; // Assign the found user to req.user
  next();
});