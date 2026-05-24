import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";
import * as emailService from "../src/services/email.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env";

vi.mock("../src/config/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    verificationCode: {
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    passwordResetCode: {
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  }
}));

vi.mock("../src/services/email.service", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  }
}));

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPassword = "Password@123";

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: false,
      } as any);

      const res = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: validPassword,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Cadastro realizado/);
      expect(prisma.verificationCode.upsert).toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it("should return error if email already exists and verified", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: true,
      } as any);

      const res = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: validPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email já cadastrado.");
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully when credentials are correct and verified", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: true,
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: validPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should throw error if email not verified and resend code", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: false,
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: validPassword,
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Email não verificado/);
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe("POST /auth/verify-email", () => {
    it("should verify email successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: false,
        verificationCode: {
          code: "123456",
          expiresAt: new Date(Date.now() + 10000), // future
        }
      } as any);
      
      const res = await request(app).post("/auth/verify-email").send({
        email: "test@example.com",
        code: "123456"
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Email verificado com sucesso/);
    });
  });

  describe("POST /auth/resend-code", () => {
    it("should resend verification code for unverified user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: false,
      } as any);

      const res = await request(app).post("/auth/resend-code").send({
        email: "test@example.com"
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Um novo código de verificação foi enviado/);
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should initiate password reset for verified user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: true,
      } as any);

      const res = await request(app).post("/auth/forgot-password").send({
        email: "test@example.com",
      });

      expect(res.status).toBe(200);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });
  });

  describe("POST /auth/reset-password", () => {
    it("should reset password successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
        password: "hashed_password",
        isVerified: true,
        passwordResetCode: {
          code: "123456",
          expiresAt: new Date(Date.now() + 10000), // future
        }
      } as any);

      const res = await request(app).post("/auth/reset-password").send({
        email: "test@example.com",
        code: "123456",
        newPassword: validPassword
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Senha resetada com sucesso/);
    });
  });

  describe("GET /auth/me", () => {
    it("should return user info when authenticated", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "test@example.com",
        name: "Test User",
      } as any);
      
      const token = jwt.sign({ sub: "user-id" }, env.JWT_SECRET);

      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe("user-id");
    });

    it("should return 401 when token is missing", async () => {
      const res = await request(app).get("/auth/me");
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Token não fornecido.");
    });
  });
});
