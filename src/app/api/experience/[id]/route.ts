import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { ExperienceModel } from "@/models/Experience";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { serializeExperience } from "@/lib/portfolio-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectToDatabase();
    const payload = await request.json();
    const updated = await ExperienceModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Experience not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeExperience(updated));
  } catch {
    return NextResponse.json(
      { message: "Could not update experience." },
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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectToDatabase();
    const deleted = await ExperienceModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Experience not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Experience deleted." });
  } catch {
    return NextResponse.json(
      { message: "Could not delete experience." },
      { status: 500 },
    );
  }
}
