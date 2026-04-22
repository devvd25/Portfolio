import type {
  PortfolioProfile,
  PortfolioProject,
  SkillCategory,
  PortfolioExperience,
  PortfolioActivity,
  PortfolioResearch,
} from "@/types/portfolio";

export const FALLBACK_AVATAR_URL =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=900&q=80";

export const defaultProfileSeed: Omit<PortfolioProfile, "id"> = {
  fullName: "Nguyen Minh Anh",
  headline: "Full-stack Developer crafting thoughtful digital products",
  location: "Ho Chi Minh City, Viet Nam",
  bio: "I build fast, elegant products with a strong focus on user experience, maintainable architecture, and real business impact. My sweet spot is shipping modern web apps from concept to production.",
  email: "hello@minhanh.dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  avatarUrl: FALLBACK_AVATAR_URL,
  cvUrl: "",
};

export const defaultProjectsSeed: Array<Omit<PortfolioProject, "id">> = [
  {
    title: "PetSphere Studio",
    summary:
      "A premium booking platform for pet services with an expressive clay-inspired interface, role-based dashboards, and payment integration.",
    stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: true,
    order: 1,
  },
  {
    title: "InsightBoard Analytics",
    summary:
      "A real-time team dashboard for product and growth metrics, combining streaming data, collaborative notes, and custom report builders.",
    stack: ["Next.js", "Node.js", "Socket.IO", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: true,
    order: 2,
  },
  {
    title: "Orbit Commerce",
    summary:
      "An ecommerce experience with personalized recommendations, robust admin tools, and conversion-first checkout journeys.",
    stack: ["React", "Tailwind", "Node.js", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: false,
    order: 3,
  },
];

export const defaultSkills: SkillCategory[] = [
  {
    title: "Frontend Craft",
    description: "Interactive interfaces with performance-first architecture.",
    items: [
      "Next.js App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    title: "Backend Engineering",
    description: "Secure APIs and scalable service design.",
    items: ["Node.js", "REST APIs", "Auth", "Caching", "Validation"],
  },
  {
    title: "Data and DevOps",
    description: "Reliable delivery pipelines and cloud-ready deployment.",
    items: ["MongoDB", "Mongoose", "Vercel", "CI/CD", "Monitoring"],
  },
];

export const defaultExperienceSeed: Array<Omit<PortfolioExperience, "id">> = [
  {
    company: "Ikigai Company",
    role: "Full-stack Developer",
    period: "2024 — 2025",
    tasks: [
      "Xây dựng và phát triển các tính năng cốt lõi cho nền tảng của công ty.",
      "Tối ưu hóa hiệu suất ứng dụng và cải thiện UX/UI.",
      "Làm việc trực tiếp với khách hàng để lấy yêu cầu và thiết kế giải pháp.",
      "Quản lý database và deployment server."
    ],
    techStack: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    companyImageUrl: "/activities/ikigai-company.jpg",
    environmentImageUrl: "/activities/ikigai-environment.jpg",
    order: 1,
  }
];

export const defaultActivitiesSeed: Array<Omit<PortfolioActivity, "id">> = [
  {
    title: "Tình nguyện làm sạch biển",
    description: "Tham gia cùng cộng đồng làm sạch bãi biển địa phương.",
    imageUrl: "/activities/beach-cleanup.png",
    category: "community",
    order: 1,
  },
  {
    title: "Tham quan bảo tàng",
    description: "Khám phá lịch sử và văn hóa nghệ thuật.",
    imageUrl: "/activities/museum-visit.png",
    category: "community",
    order: 2,
  },
  {
    title: "Workshop Chuyển đổi số",
    description: "Chia sẻ về ứng dụng AI trong doanh nghiệp.",
    imageUrl: "/activities/digital-transformation.png",
    category: "workshop",
    order: 1,
  }
];

export const defaultResearchSeed: Array<Omit<PortfolioResearch, "id">> = [
  {
    title: "Flower Classification Using EfficientNetB0 with Grad-CAM Explainability",
    period: "02/2026 — 04/2026",
    authors: ["Rmah Viu", "Nguyễn Thanh Phước", "Phan Thanh Huy"],
    abstract: "Nghiên cứu ứng dụng mô hình Deep Learning (EfficientNetB0) vào việc phân loại các loài hoa, kết hợp với Grad-CAM để giải thích dự đoán của mô hình bằng bản đồ nhiệt (heatmap).",
    technologies: ["EfficientNetB0", "Transfer Learning", "Grad-CAM", "Python"],
    achievements: [
      "Đạt độ chính xác 98.5% trên tập test",
      "Triển khai thành công web app demo bằng Gradio",
      "Giải thích được vùng đặc trưng ảnh hưởng tới dự đoán"
    ],
    demoUrl: "https://huggingface.co/spaces/viugialai/Flower-Recognition-Using-Deep-Learning",
    documentUrl: "https://v0-portfolio-viu.vercel.app/ICT2026-Flower-Classification-Research.docx",
    order: 1,
  }
];
