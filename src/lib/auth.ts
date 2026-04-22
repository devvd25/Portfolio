import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import type { AdminSession } from "@/types/portfolio";

export const ADMIN_COOKIE_NAME = "portfolio_admin_token";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function secureCompare(left: string, right: string) {
  const maxLength = Math.max(Buffer.byteLength(left), Buffer.byteLength(right), 1);
  const leftBuffer = Buffer.alloc(maxLength);
  const rightBuffer = Buffer.alloc(maxLength);

  leftBuffer.write(left);
  rightBuffer.write(right);

  return (
    timingSafeEqual(leftBuffer, rightBuffer) &&
    Buffer.byteLength(left) === Buffer.byteLength(right)
  );
}

export function hasAdminCredentialsConfigured() {
  return Boolean(ADMIN_EMAIL) && Boolean(ADMIN_PASSWORD);
}

function getJwtSecret() {
  const jwtSecret =
    process.env.ADMIN_JWT_SECRET ?? "replace-this-secret-before-deploy";

  return new TextEncoder().encode(jwtSecret);
}

export async function verifyAdminCredentials(email: string, password: string) {
  if (!hasAdminCredentialsConfigured()) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isEmailValid = secureCompare(normalizedEmail, ADMIN_EMAIL);
  const isPasswordValid = secureCompare(password, ADMIN_PASSWORD);

  if (!isEmailValid || !isPasswordValid) {
    return null;
  }

  return {
    id: ADMIN_EMAIL,
    email: ADMIN_EMAIL,
    role: "admin" as const,
  };
}

export async function createAdminSession(payload: AdminSession) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (payload.role !== "admin" || !payload.sub || !payload.email) {
      return null;
    }

    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: "admin" as const,
    };
  } catch {
    return null;
  }
}
