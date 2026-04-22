import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { OtherExperienceModel } from "@/models/OtherExperience";
import { serializeOtherExperience } from "@/lib/portfolio-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const updated = await OtherExperienceModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Other experience not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeOtherExperience(updated));
  } catch {
    return NextResponse.json(
      { message: "Could not update other experience." },
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
    const deleted = await OtherExperienceModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Other experience not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Other experience deleted." });
  } catch {
    return NextResponse.json(
      { message: "Could not delete other experience." },
      { status: 500 },
    );
  }
}
