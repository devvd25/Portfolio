import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { ExperienceModel } from "@/models/Experience";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeExperience(doc: {
  _id: unknown;
  company: string;
  role: string;
  period: string;
  tasks: string[];
  techStack: string[];
  companyImageUrl?: string;
  environmentImageUrl?: string;
  order: number;
}) {
  return {
    id: String(doc._id),
    company: doc.company,
    role: doc.role,
    period: doc.period,
    tasks: doc.tasks,
    techStack: doc.techStack,
    companyImageUrl: doc.companyImageUrl ?? "",
    environmentImageUrl: doc.environmentImageUrl ?? "",
    order: doc.order,
  };
}

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

  try {
    await connectToDatabase();
    const docs = await ExperienceModel.find().sort({ order: 1 }).lean();
    return NextResponse.json(docs.map(serializeExperience));
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
    const payload = (await request.json()) as {
      company: string;
      role: string;
      period: string;
      tasks?: string[];
      techStack?: string[];
      companyImageUrl?: string;
      environmentImageUrl?: string;
      order?: number;
    };

    await connectToDatabase();

    const highestOrder = await ExperienceModel.findOne()
      .sort({ order: -1 })
      .select("order")
      .lean();

    const order = payload.order ?? (highestOrder?.order ?? 0) + 1;

    const created = await ExperienceModel.create({ ...payload, order });
    const doc = await ExperienceModel.findById(created._id).lean();

    if (!doc) {
      return NextResponse.json(
        { message: "Failed to create experience." },
        { status: 500 },
      );
    }

    return NextResponse.json(serializeExperience(doc), { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Could not create experience." },
      { status: 500 },
    );
  }
}
