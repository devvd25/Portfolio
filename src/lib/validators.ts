import { z } from "zod";

const httpUrl = z.url("Vui long nhap URL hop le.");
const optionalHttpUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    message: "Vui long nhap URL hop le bat dau bang http:// hoac https://",
  })
  .default("");

const localizedStringSchema = (min: number, label: string) => z.object({
  vi: z.string().trim().min(min, `${label} (tiếng Việt) quá ngắn.`),
  en: z.string().trim().min(min, `${label} (English) is too short.`),
});

export const loginSchema = z.object({
  email: z.email("Email khong hop le.").trim(),
  password: z.string().trim().min(1, "Mat khau khong duoc de trong."),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Ten qua ngan."),
  headline: localizedStringSchema(5, "Headline"),
  role: localizedStringSchema(2, "Chức danh"),
  location: localizedStringSchema(2, "Dia diem"),
  bio: localizedStringSchema(20, "Bio"),
  email: z.email("Email khong hop le.").trim(),
  githubUrl: optionalHttpUrl,
  linkedinUrl: optionalHttpUrl,
  avatarUrl: optionalHttpUrl,
  cvUrl: optionalHttpUrl,
  stats: z.object({
    years: z.string().default(""),
    projects: z.string().default(""),
    countries: z.string().default(""),
    reviews: z.string().default(""),
  }).optional(),
});

export const projectSchema = z.object({
  title: localizedStringSchema(2, "Ten du an"),
  summary: localizedStringSchema(20, "Mo ta du an"),
  stack: z.array(z.string().trim().min(1)).min(1, "Can it nhat 1 cong nghe."),
  imageUrl: optionalHttpUrl,
  demoUrl: optionalHttpUrl,
  repoUrl: optionalHttpUrl,
  featured: z.boolean().default(false),
  order: z.number().int().min(1).optional(),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(2, "Ten cong ty qua ngan."),
  role: localizedStringSchema(2, "Chuc vu"),
  period: localizedStringSchema(2, "Thoi gian"),
  tasks: z.array(localizedStringSchema(5, "Nhiem vu")),
  techStack: z.array(z.string().trim().min(1)),
  companyImageUrl: optionalHttpUrl,
  environmentImageUrl: optionalHttpUrl,
  order: z.number().int().min(1).optional(),
  type: z.enum(["work", "other"]).default("work"),
  isHidden: z.boolean().default(false),
});

export const activitySchema = z.object({
  title: localizedStringSchema(2, "Tieu de hoat dong"),
  description: localizedStringSchema(10, "Mo ta hoat dong"),
  imageUrl: optionalHttpUrl,
  category: z.enum(["community", "workshop"]),
  order: z.number().int().min(1).optional(),
});

export const researchSchema = z.object({
  title: localizedStringSchema(5, "Tieu de nghien cuu"),
  period: localizedStringSchema(2, "Thoi gian"),
  authors: z.array(z.string().trim().min(2)),
  abstract: localizedStringSchema(50, "Abstract"),
  technologies: z.array(z.string().trim().min(1)),
  achievements: z.array(localizedStringSchema(5, "Thanh tuu")),
  demoUrl: optionalHttpUrl,
  documentUrl: optionalHttpUrl,
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
