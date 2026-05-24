import { EMAIL_FROM, transporter } from "../config/email";

interface SendVerificationEmailParams {
  to: string;
  name: string;
  code: string;
}

export async function sendVerificationEmail({
  to,
  name,
  code,
}: SendVerificationEmailParams): Promise<void> {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "Confirme seu cadastro — Código de verificação",
    text: `Olá, ${name}!\n\nSeu código de verificação é: ${code}\n\nEle expira em 15 minutos.\n\nSe você não solicitou isso, ignore este email.`,
    html: buildemailHtml({
      title: "Verificação de Email",
      name,
      code,
      description:
        "Obrigado por se registrar! Para concluir seu cadastro, use o código abaixo para verificar seu email.",
      footerNote:
        "Se você não solicitou isso, ignore este email. Este código é válido por 15 minutos.",
    }),
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  code,
}: SendVerificationEmailParams): Promise<void> {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "Redefinição de senha — Código de verificação",
    text: `Olá, ${name}!\n\nSeu código para redefinir a senha é: ${code}\n\nEle expira em 15 minutos.\n\nSe você não solicitou isso, ignore este email.`,
    html: buildemailHtml({
      title: "Redefinição de Senha",
      name,
      code,
      description: "Use o código abaixo para redefinir sua senha.",
      footerNote:
        "Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanece a mesma.",
    }),
  });
}

interface EmailHtmlParams {
  title: string;
  name: string;
  code: string;
  description: string;
  footerNote: string;
}

function buildemailHtml({
  title,
  name,
  code,
  description,
  footerNote,
}: EmailHtmlParams): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
              style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
              <tr>
                <td style="background:#111827;padding:32px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:.5px;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 32px;">
                  <p style="color:#374151;font-size:16px;margin:0 0 16px;">
                    Olá, <strong>${name}</strong>!
                  </p>
                  <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">
                    ${description} Ele é válido por <strong>15 minutos</strong>.
                  </p>
                  <div style="background:#f9fafb;border:2px dashed #e5e7eb;border-radius:8px;
                              padding:24px;text-align:center;margin-bottom:32px;">
                    <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111827;">
                      ${code}
                    </span>
                  </div>
                  <p style="color:#9ca3af;font-size:13px;margin:0;">${footerNote}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
