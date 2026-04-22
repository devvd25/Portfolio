import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Ban chua dang nhap admin." },
      { status: 401 },
    );
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      {
        message:
          "Thieu bien moi truong Cloudinary. Hay cau hinh CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Khong tim thay file upload." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File qua lon. Gioi han toi da 5MB." },
        { status: 413 },
      );
    }

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { message: "Chỉ cho phép upload hình ảnh hoặc file PDF." },
        { status: 400 },
      );
    }

    configureCloudinary();

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64String}`;

    const uploadedAsset = await cloudinary.uploader.upload(dataUri, {
      folder: process.env.CLOUDINARY_FOLDER ?? "portfolio-app",
      resource_type: "auto",
      overwrite: true,
    });

    return NextResponse.json({
      url: uploadedAsset.secure_url,
      publicId: uploadedAsset.public_id,
    });
  } catch {
    return NextResponse.json(
      { message: "Khong the upload anh luc nay." },
      { status: 500 },
    );
  }
}
