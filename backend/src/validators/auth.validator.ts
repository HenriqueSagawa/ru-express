import { email, z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "O nome é obrigatório" })
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome muito longo, máximo de 100 caracteres"),
  email: z.email("Email inválido"),
  password: z
    .string({ message: "A senha é obrigatória" })
    .min(6, "A senha deve conter ao menos 6 caracteres")
    .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter ao menos um número")
    .regex(
      /[@$!%*?&]/,
      "Senha deve conter ao menos um caractere especial (@$!%*?&)",
    ),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string({ message: "A senha é obrigatória" }),
});

export const verifyEmailSchema = z.object({
  email: z.email("Email inválido"),
  code: z
    .string()
    .length(6, "O código de verificação deve conter exatamente 6 caracteres")
    .regex(/^\d+$/, "O código de verificação deve conter apenas números"),
});

export const resendCodeSchema = z.object({
  email: z.email("Email inválido"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email inválido"),
});

export const resetPasswordSchema = z.object({
  email: z.email("Email inválido"),
  code: z
    .string()
    .length(6, "O código de verificação deve conter exatamente 6 caracteres")
    .regex(/^\d+$/, "O código de verificação deve conter apenas números"),
  newPassword: z
    .string({ message: "A nova senha é obrigatória" })
    .min(6, "A nova senha deve conter ao menos 6 caracteres")
    .regex(/[A-Z]/, "A nova senha deve conter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "A nova senha deve conter ao menos um número")
    .regex(
      /[@$!%*?&]/,
      "A nova senha deve conter ao menos um caractere especial (@$!%*?&)",
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendCodeInput = z.infer<typeof resendCodeSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
