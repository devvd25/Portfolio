import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { ActivityModel } from "@/models/Activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { serializeActivity } from "@/lib/portfolio-data";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectToDatabase();
    const docs = await ActivityModel.find().sort({ order: 1 }).lean();
    return NextResponse.json(docs.map(serializeActivity));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { message: "MongoDB not configured." },
      { status: 500 },
    );
  }

  try {
    const payload = await request.json();

    await connectToDatabase();

    const highestOrder = await ActivityModel.findOne({ category: payload.category })
      .sort({ order: -1 })
      .select("order")
      .lean();

    const order = payload.order ?? (highestOrder?.order ?? 0) + 1;

    const created = await ActivityModel.create({ ...payload, order });
    const doc = await ActivityModel.findById(created._id).lean();

    if (!doc) {
      return NextResponse.json(
        { message: "Failed to create activity." },
        { status: 500 },
      );
    }

    return NextResponse.json(serializeActivity(doc as any), { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Could not create activity." },
      { status: 500 },
    );
  }
}
