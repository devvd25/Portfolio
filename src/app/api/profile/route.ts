import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { FALLBACK_AVATAR_URL } from "@/lib/default-data";
import { connectToDatabase, isMongoConfigured } from "@/lib/db";
import { getPortfolioSnapshot } from "@/lib/portfolio-data";
import { profileSchema } from "@/lib/validators";
import { PortfolioProfileModel } from "@/models/PortfolioProfile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalizedString = {
  vi: string;
  en: string;
};

function serializeProfile(profile: {
  _id: unknown;
  fullName: string;
  headline: LocalizedString;
  role: LocalizedString;
  location: LocalizedString;
  bio: LocalizedString;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  cvUrl?: string;
  stats?: {
    years: string;
    projects: string;
    countries: string;
    reviews: string;
  };
}) {
  return {
    id: String(profile._id),
    fullName: profile.fullName,
    headline: profile.headline,
    role: profile.role || { vi: "", en: "" },
    location: profile.location,
    bio: profile.bio,
    email: profile.email,
    githubUrl: profile.githubUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    avatarUrl: profile.avatarUrl || FALLBACK_AVATAR_URL,
    cvUrl: profile.cvUrl ?? "",
    stats: profile.stats || {
      years: "",
      projects: "",
      countries: "",
      reviews: "",
    },
  };
}

export async function GET() {
  const snapshot = await getPortfolioSnapshot();
  return NextResponse.json(snapshot.profile);
}

export async function PUT(request: Request) {
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
          "Thieu MONGODB_URI. Khong the cap nhat profile khi chua ket noi database.",
      },
      { status: 500 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = profileSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Du lieu profile khong hop le.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const updatedProfile = await PortfolioProfileModel.findOneAndUpdate(
      { key: "main" },
      { key: "main", ...parsed.data },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    if (!updatedProfile) {
      return NextResponse.json(
        { message: "Khong tim thay profile de cap nhat." },
        { status: 500 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(serializeProfile(updatedProfile as any));
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Khong the cap nhat profile luc nay.", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
