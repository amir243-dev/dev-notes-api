import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response } from "express";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

// ================================================================

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

// =========================================================================

export const getMe = async (req: Request, res: Response) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return res.status(401).json({ message: "Not authorized" });
};
