import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { getPortfolioSnapshot } from "@/lib/portfolio-data";
import { projectSchema } from "@/lib/validators";
import { ProjectModel } from "@/models/Project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { serializeProject } from "@/lib/portfolio-data";

export async function GET() {
  const snapshot = await getPortfolioSnapshot();
  return NextResponse.json(snapshot.projects);
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Ban chua dang nhap admin." },
      { status: 401 },
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        message:
          "Thieu MONGODB_URI. Khong the tao project khi chua ket noi database.",
      },
      { status: 500 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = projectSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Du lieu project khong hop le.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const highestOrderProject = await ProjectModel.findOne()
      .sort({ order: -1 })
      .select("order")
      .lean();

    const order = parsed.data.order ?? (highestOrderProject?.order ?? 0) + 1;

    const createdProject = await ProjectModel.create({
      ...parsed.data,
      order,
    });

    const createdRecord = await ProjectModel.findById(createdProject._id).lean();

    if (!createdRecord) {
      return NextResponse.json(
        { message: "Khong the tao project moi." },
        { status: 500 },
      );
    }

    return NextResponse.json(serializeProject(createdRecord), { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Khong the tao project luc nay." },
      { status: 500 },
    );
  }
}
