import { z } from "zod";

const httpUrl = z.url("Vui long nhap URL hop le.");
const optionalHttpUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    message: "Vui long nhap URL hop le bat dau bang http:// hoac https://",
  })
  .default("");

export const loginSchema = z.object({
  email: z.email("Email khong hop le.").trim(),
  password: z.string().trim().min(1, "Mat khau khong duoc de trong."),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Ten qua ngan."),
  headline: z.string().trim().min(5, "Headline qua ngan."),
  location: z.string().trim().min(2, "Vui long nhap dia diem."),
  bio: z.string().trim().min(20, "Bio toi thieu 20 ky tu."),
  email: z.email("Email khong hop le.").trim(),
  githubUrl: optionalHttpUrl,
  linkedinUrl: optionalHttpUrl,
  avatarUrl: optionalHttpUrl,
  cvUrl: optionalHttpUrl,
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Ten du an qua ngan."),
  summary: z.string().trim().min(20, "Mo ta toi thieu 20 ky tu."),
  stack: z.array(z.string().trim().min(1)).min(1, "Can it nhat 1 cong nghe."),
  imageUrl: optionalHttpUrl,
  demoUrl: optionalHttpUrl,
  repoUrl: optionalHttpUrl,
  featured: z.boolean().default(false),
  order: z.number().int().min(1).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const imageUploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().max(5 * 1024 * 1024),
});

export function parseStackInput(stackText: string) {
  return stackText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validatePublicUrl(url: string) {
  if (!url) {
    return true;
  }

  return httpUrl.safeParse(url).success;
}
