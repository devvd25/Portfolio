import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { ResearchModel } from "@/models/Research";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { serializeResearch } from "@/lib/portfolio-data";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectToDatabase();
    const docs = await ResearchModel.find().sort({ order: 1 }).lean();
    return NextResponse.json(docs.map(serializeResearch));
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

    const highestOrder = await ResearchModel.findOne()
      .sort({ order: -1 })
      .select("order")
      .lean();

    const order = payload.order ?? (highestOrder?.order ?? 0) + 1;

    const created = await ResearchModel.create({ ...payload, order });
    const doc = await ResearchModel.findById(created._id).lean();

    if (!doc) {
      return NextResponse.json(
        { message: "Failed to create research entry." },
        { status: 500 },
      );
    }

    return NextResponse.json(serializeResearch(doc as any), { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Could not create research entry." },
      { status: 500 },
    );
  }
}
