import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resendCode(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = resendCodeSchema.parse(req.body);
    const result = await authService.resendCode(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const result = await authService.getMe(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const body = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const body = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}