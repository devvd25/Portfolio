import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { getPortfolioSnapshot } from "@/lib/portfolio-data";
import { projectUpdateSchema } from "@/lib/validators";
import { ProjectModel } from "@/models/Project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeProject(project: {
  _id: unknown;
  title: string;
  summary: string;
  stack: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  order: number;
}) {
  return {
    id: String(project._id),
    title: project.title,
    summary: project.summary,
    stack: project.stack,
    imageUrl: project.imageUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: Boolean(project.featured),
    order: project.order,
  };
}

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isMongoConfigured() || !isValidObjectId(id)) {
    const snapshot = await getPortfolioSnapshot();
    const localProject = snapshot.projects.find((project) => project.id === id);

    if (!localProject) {
      return NextResponse.json({ message: "Khong tim thay project." }, { status: 404 });
    }

    return NextResponse.json(localProject);
  }

  await connectToDatabase();

  const project = await ProjectModel.findById(id).lean();

  if (!project) {
    return NextResponse.json({ message: "Khong tim thay project." }, { status: 404 });
  }

  return NextResponse.json(serializeProject(project));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
          "Thieu MONGODB_URI. Khong the cap nhat project khi chua ket noi database.",
      },
      { status: 500 },
    );
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "ID project khong hop le." }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const parsed = projectUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Du lieu project khong hop le.",
        },
        { status: 400 },
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json(
        { message: "Khong co du lieu de cap nhat." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const updatedProject = await ProjectModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();

    if (!updatedProject) {
      return NextResponse.json({ message: "Khong tim thay project." }, { status: 404 });
    }

    return NextResponse.json(serializeProject(updatedProject));
  } catch {
    return NextResponse.json(
      { message: "Khong the cap nhat project luc nay." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
          "Thieu MONGODB_URI. Khong the xoa project khi chua ket noi database.",
      },
      { status: 500 },
    );
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "ID project khong hop le." }, { status: 400 });
  }

  await connectToDatabase();

  const deletedProject = await ProjectModel.findByIdAndDelete(id).lean();

  if (!deletedProject) {
    return NextResponse.json({ message: "Khong tim thay project." }, { status: 404 });
  }

  return NextResponse.json({ message: "Da xoa project." });
}
