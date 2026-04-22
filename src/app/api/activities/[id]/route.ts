import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ActivityModel } from "@/models/Activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeActivity(doc: {
  _id: unknown;
  title: string;
  description: string;
  imageUrl?: string;
  category: "community" | "workshop";
  order: number;
}) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl ?? "",
    category: doc.category,
    order: doc.order,
  };
}

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
    const updated = await ActivityModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Activity not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(serializeActivity(updated as any));
  } catch {
    return NextResponse.json(
      { message: "Could not update activity." },
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
    const deleted = await ActivityModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Activity not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Activity deleted." });
  } catch {
    return NextResponse.json(
      { message: "Could not delete activity." },
      { status: 500 },
    );
  }
}
