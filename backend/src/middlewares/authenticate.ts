import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

interface JwtPayload {
  sub: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Token não fornecido.", 401));
  }

  const token = authHeader.split(" ")[1];
  const secret = env.JWT_SECRET;

  try {
    const payload = jwt.verify(token!, secret) as JwtPayload;
    (req as Request & { userId: string }).userId = payload.sub;
    next();
  } catch {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}
