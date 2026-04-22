import { NextResponse } from "next/server";

import {
  createAdminSession,
  hasAdminCredentialsConfigured,
  verifyAdminCredentials,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

function getDebugPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const body = payload as Record<string, unknown>;

  return {
    email: typeof body.email === "string" ? body.email : null,
    passwordProvided: typeof body.password === "string",
    passwordLength:
      typeof body.password === "string" ? body.password.length : null,
  };
}

export async function POST(request: Request) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch (parseError) {
      console.error("[api/auth/login] Invalid JSON payload:", parseError);

      return NextResponse.json(
        {
          success: false,
          message: "Noi dung yeu cau khong hop le.",
        },
        { status: 400 },
      );
    }

    console.log("[api/auth/login] Request body:", getDebugPayload(payload));

    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      console.error(
        "[api/auth/login] Validation error:",
        parsed.error.flatten().fieldErrors,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Vui long nhap day du email va mat khau.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (!hasAdminCredentialsConfigured()) {
      console.error(
        "[api/auth/login] Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment.",
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "He thong chua cau hinh ADMIN_EMAIL va ADMIN_PASSWORD trong .env.local.",
        },
        { status: 500 },
      );
    }

    const admin = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password,
    );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    await createAdminSession({
      sub: admin.id,
      email: admin.email,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Dang nhap thanh cong.",
      session: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[api/auth/login] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Khong the dang nhap luc nay.",
      },
      { status: 500 },
    );
  }
}
