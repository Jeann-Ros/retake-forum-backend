import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type AuthPayload = {
  id: string | number;
  email: string;
  role: "ADMIN" | "USER";
};

type AuthRequest = Request & { user?: AuthPayload };

export const generateToken = (user: AuthPayload) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthPayload;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado" });
  }

  return next();
};
