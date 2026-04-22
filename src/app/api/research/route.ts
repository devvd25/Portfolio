import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { ResearchModel } from "@/models/Research";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeResearch(doc: {
  _id: unknown;
  title: string;
  period: string;
  authors: string[];
  abstract: string;
  technologies: string[];
  achievements: string[];
  demoUrl?: string;
  documentUrl?: string;
  order: number;
}) {
  return {
    id: String(doc._id),
    title: doc.title,
    period: doc.period,
    authors: doc.authors,
    abstract: doc.abstract,
    technologies: doc.technologies,
    achievements: doc.achievements,
    demoUrl: doc.demoUrl ?? "",
    documentUrl: doc.documentUrl ?? "",
    order: doc.order,
  };
}

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
    const payload = (await request.json()) as {
      title: string;
      period: string;
      authors?: string[];
      abstract: string;
      technologies?: string[];
      achievements?: string[];
      demoUrl?: string;
      documentUrl?: string;
      order?: number;
    };

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
