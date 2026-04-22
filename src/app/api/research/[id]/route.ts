import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ResearchModel } from "@/models/Research";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { serializeResearch } from "@/lib/portfolio-data";

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
    const updated = await ResearchModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Research entry not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeResearch(updated as any));
  } catch {
    return NextResponse.json(
      { message: "Could not update research entry." },
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
    const deleted = await ResearchModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Research entry not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Research entry deleted." });
  } catch {
    return NextResponse.json(
      { message: "Could not delete research entry." },
      { status: 500 },
    );
  }
}
