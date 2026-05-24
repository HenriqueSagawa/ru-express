import crypto from "crypto";

export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function getCodeExpiration(minutesFromNow = 15): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutesFromNow);
  return expiration;
}
