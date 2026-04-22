import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { OtherExperienceModel } from "@/models/OtherExperience";
import { serializeOtherExperience } from "@/lib/portfolio-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectToDatabase();
    const docs = await OtherExperienceModel.find().sort({ order: 1 }).lean();
    return NextResponse.json(docs.map(serializeOtherExperience));
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

    const highestOrder = await OtherExperienceModel.findOne()
      .sort({ order: -1 })
      .select("order")
      .lean();

    const order = payload.order ?? (highestOrder?.order ?? 0) + 1;

    const created = await OtherExperienceModel.create({ ...payload, order });
    const doc = await OtherExperienceModel.findById(created._id).lean();

    if (!doc) {
      return NextResponse.json(
        { message: "Failed to create other experience." },
        { status: 500 },
      );
    }

    return NextResponse.json(serializeOtherExperience(doc), { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Could not create other experience." },
      { status: 500 },
    );
  }
}
