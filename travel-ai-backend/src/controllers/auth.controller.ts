import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";
import { registerSchema,loginSchema } from "../validations/auth.validator.js";

export const register = async (
  req: Request,
  res: Response
) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const result = registerSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({
    message: "Invalid input",
  });
}

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    token: generateToken(user._id.toString()),
    user,
  });
};

export const login = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
  const result = loginSchema.safeParse(req.body);

if (!result.success) {
    return res.status(400).json({
    message: "Invalid input",
  });
}

  const match = await bcrypt.compare(
    password,
    user.password
  );

  if (!match) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  res.json({
    token: generateToken(user._id.toString()),
    user,
  });
};