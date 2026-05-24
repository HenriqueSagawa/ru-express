import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import {
  generateVerificationCode,
  getCodeExpiration,
} from "../utils/generateCode";
import { sendVerificationEmail } from "./email.service";
import type {
  LoginInput,
  RegisterInput,
  ResendCodeInput,
  VerifyEmailInput,
} from "../validators/auth.validator";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || "1h";

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    if (!existing.isVerified) {
      await issueAndSendCode(existing.id, existing.email, existing.name);
      return {
        message:
          "Email já cadastrado, mas não verificado. Um novo código de verificação foi enviado.",
      };
    }

    throw new AppError("Email já cadastrado.", 400);
  }

  const password = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password,
    },
  });

  await issueAndSendCode(user.id, user.email, user.name);

  return {
    message: "Cadastro realizado! Verifique seu email para ativar a conta.",
    userId: user.id,
  };
}

export async function verifyEmail(data: VerifyEmailInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { verificationCode: true },
  });

  if (!user) throw new AppError("Credenciais inválidas.", 401);
  if (user.isVerified) throw new AppError("Email já verificado.", 401);

  const record = user.verificationCode;
  if (!record)
    throw new AppError("Nenhum código pendente. Solicite um novo.", 401);

  if (new Date() > record.expiresAt) {
    await prisma.verificationCode.delete({ where: { userId: record.userId } });
    throw new AppError("Código expirado. Solicite um novo.", 401);
  }

  if (record.code !== data.code) throw new AppError("Código inválido.", 401);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { isVerified: true } }),
    prisma.verificationCode.delete({ where: { userId: user.id } }),
  ]);

  const token = signToken(user.id);

  return {
    message: "Email verificado com sucesso!",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function resendCode(data: ResendCodeInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new AppError("Email não encontrado.", 404);
  if (user.isVerified) throw new AppError("Email já verificado.", 400);

  await issueAndSendCode(user.id, user.email, user.name);

  return {
    message: "Um novo código de verificação foi enviado para seu email.",
  };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new AppError("Credenciais inválidas.", 401);

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) throw new AppError("Credenciais inválidas.", 401);

  if (!user.isVerified) {
    await issueAndSendCode(user.id, user.email, user.name);
    throw new AppError(
      "Email não verificado. Um novo código de verificação foi enviado.",
      403,
    );
  }

  const token = signToken(user.id);

  return {
    message: "Login bem-sucedido!",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) throw new AppError("Usuário não encontrado.", 404);

  return user;
}

async function issueAndSendCode(userId: string, email: string, name: string) {
  const code = generateVerificationCode();
  const expiresAt = getCodeExpiration();

  await prisma.verificationCode.upsert({
    where: { userId },
    update: { code, expiresAt },
    create: { userId, code, expiresAt },
  });

  await sendVerificationEmail({ to: email, name, code });
}

function signToken(userId: string): string {
  // @ts-ignore
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}
