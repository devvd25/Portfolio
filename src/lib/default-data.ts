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
  headline: {
    vi: "Lập trình viên Full-stack tạo ra các sản phẩm kỹ thuật số ý nghĩa",
    en: "Full-stack Developer crafting thoughtful digital products",
  },
  role: {
    vi: "Kỹ sư hướng sản phẩm",
    en: "Product-Oriented Engineer",
  },
  location: {
    vi: "Đà Nẵng, Việt Nam",
    en: "Da Nang, Viet Nam",
  },
  bio: {
    vi: "Tôi thích biến mục tiêu sản phẩm thành trải nghiệm hoàn chỉnh, từ ý tưởng UX đến hệ thống backend bền vững. Mỗi dự án cân bằng giữa tốc độ, thẩm mỹ và khả năng bảo trì để đội ngũ phát triển tự tin.",
    en: "I love turning product goals into complete experiences, from UX ideas to sustainable backend systems. Each project balances speed, aesthetics, and maintainability for the development team to be confident.",
  },
  email: "hello@minhanh.dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  avatarUrl: FALLBACK_AVATAR_URL,
  cvUrl: "",
  stats: {
    years: "5+",
    projects: "20+",
    countries: "8",
    reviews: "4.9/5",
  },
};

export const defaultProjectsSeed: Array<Omit<PortfolioProject, "id">> = [
  {
    title: {
      vi: "PetSphere Studio",
      en: "PetSphere Studio",
    },
    summary: {
      vi: "Một nền tảng đặt chỗ cao cấp cho các dịch vụ thú cưng với giao diện lấy cảm hứng từ đất sét, bảng điều khiển phân quyền và tích hợp thanh toán.",
      en: "A premium booking platform for pet services with an expressive clay-inspired interface, role-based dashboards, and payment integration.",
    },
    stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: true,
    order: 1,
    isHidden: false,
  },
  {
    title: {
      vi: "InsightBoard Analytics",
      en: "InsightBoard Analytics",
    },
    summary: {
      vi: "Bảng điều khiển nhóm thời gian thực cho các chỉ số sản phẩm và tăng trưởng, kết hợp dữ liệu trực tiếp, ghi chú cộng tác và trình tạo báo cáo tùy chỉnh.",
      en: "A real-time team dashboard for product and growth metrics, combining streaming data, collaborative notes, and custom report builders.",
    },
    stack: ["Next.js", "Node.js", "Socket.IO", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: true,
    order: 2,
    isHidden: false,
  },
  {
    title: {
      vi: "Orbit Commerce",
      en: "Orbit Commerce",
    },
    summary: {
      vi: "Trải nghiệm thương mại điện tử với đề xuất cá nhân hóa, công cụ quản trị mạnh mẽ và quy trình thanh toán tối ưu chuyển đổi.",
      en: "An ecommerce experience with personalized recommendations, robust admin tools, and conversion-first checkout journeys.",
    },
    stack: ["React", "Tailwind", "Node.js", "MongoDB"],
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://example.vercel.app",
    repoUrl: "https://github.com",
    featured: false,
    order: 3,
    isHidden: false,
  },
];

export const defaultSkills: SkillCategory[] = [
  {
    title: {
      vi: "Kỹ thuật Frontend",
      en: "Frontend Craft",
    },
    description: {
      vi: "Giao diện tương tác với kiến trúc ưu tiên hiệu suất.",
      en: "Interactive interfaces with performance-first architecture.",
    },
    items: [
      "Next.js App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    title: {
      vi: "Kỹ thuật Backend",
      en: "Backend Engineering",
    },
    description: {
      vi: "API an toàn và thiết kế dịch vụ có khả năng mở rộng.",
      en: "Secure APIs and scalable service design.",
    },
    items: ["Node.js", "REST APIs", "Auth", "Caching", "Validation"],
  },
  {
    title: {
      vi: "Dữ liệu & DevOps",
      en: "Data and DevOps",
    },
    description: {
      vi: "Luồng triển khai đáng tin cậy và vận hành trên đám mây.",
      en: "Reliable deployment pipelines and cloud operations.",
    },
    items: ["MongoDB", "Mongoose", "Vercel", "CI/CD", "Monitoring"],
  },
];

export const defaultExperienceSeed: Array<Omit<PortfolioExperience, "id">> = [
  {
    company: "Ikigai Company",
    role: {
      vi: "Lập trình viên Full-stack",
      en: "Full-stack Developer",
    },
    period: {
      vi: "2024 — 2025",
      en: "2024 — 2025",
    },
    tasks: [
      {
        vi: "Xây dựng và phát triển các tính năng cốt lõi cho nền tảng của công ty.",
        en: "Build and develop core features for the company platform.",
      },
      {
        vi: "Tối ưu hóa hiệu suất ứng dụng và cải thiện UX/UI.",
        en: "Optimize application performance and improve UX/UI.",
      },
      {
        vi: "Làm việc trực tiếp với khách hàng để lấy yêu cầu và thiết kế giải pháp.",
        en: "Work directly with clients to gather requirements and design solutions.",
      },
      {
        vi: "Quản lý database và deployment server.",
        en: "Manage database and deployment servers.",
      }
    ],
    techStack: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    companyImageUrl: "/activities/ikigai-company.jpg",
    environmentImageUrl: "/activities/ikigai-environment.jpg",
    order: 1,
    isHidden: false,
  }
];

export const defaultActivitiesSeed: Array<Omit<PortfolioActivity, "id">> = [
  {
    title: {
      vi: "Tình nguyện làm sạch biển",
      en: "Beach Cleanup Volunteer",
    },
    description: {
      vi: "Tham gia cùng cộng đồng làm sạch bãi biển địa phương.",
      en: "Join the community to clean up local beaches.",
    },
    imageUrl: "/activities/beach-cleanup.png",
    category: "community",
    order: 1,
    isHidden: false,
  },
  {
    title: {
      vi: "Tham quan bảo tàng",
      en: "Museum Visit",
    },
    description: {
      vi: "Khám phá lịch sử và văn hóa nghệ thuật.",
      en: "Explore art history and culture.",
    },
    imageUrl: "/activities/museum-visit.png",
    category: "community",
    order: 2,
    isHidden: false,
  },
  {
    title: {
      vi: "Workshop Chuyển đổi số",
      en: "Digital Transformation Workshop",
    },
    description: {
      vi: "Chia sẻ về ứng dụng AI trong doanh nghiệp.",
      en: "Share about AI applications in business.",
    },
    imageUrl: "/activities/digital-transformation.png",
    category: "workshop",
    order: 1,
    isHidden: false,
  }
];

export function buildLocalOtherExperience() {
  return [];
}

export const defaultResearchSeed: Array<Omit<PortfolioResearch, "id">> = [
  {
    title: {
      vi: "Phân loại hoa sử dụng EfficientNetB0 với giải thích Grad-CAM",
      en: "Flower Classification Using EfficientNetB0 with Grad-CAM Explainability",
    },
    period: {
      vi: "02/2026 — 04/2026",
      en: "02/2026 — 04/2026",
    },
    authors: ["Rmah Viu", "Nguyễn Thanh Phước", "Phan Thanh Huy"],
    abstract: {
      vi: "Nghiên cứu ứng dụng mô hình Deep Learning (EfficientNetB0) vào việc phân loại các loài hoa, kết hợp với Grad-CAM để giải thích dự đoán của mô hình bằng bản đồ nhiệt (heatmap).",
      en: "Research applying Deep Learning model (EfficientNetB0) to classify flower species, combined with Grad-CAM to explain model predictions using heatmaps.",
    },
    technologies: ["EfficientNetB0", "Transfer Learning", "Grad-CAM", "Python"],
    achievements: [
      {
        vi: "Đạt độ chính xác 98.5% trên tập test",
        en: "Achieved 98.5% accuracy on the test set",
      },
      {
        vi: "Triển khai thành công web app demo bằng Gradio",
        en: "Successfully deployed web app demo using Gradio",
      },
      {
        vi: "Giải thích được vùng đặc trưng ảnh hưởng tới dự đoán",
        en: "Explained feature regions affecting predictions",
      }
    ],
    demoUrl: "https://huggingface.co/spaces/viugialai/Flower-Recognition-Using-Deep-Learning",
    documentUrl: "https://v0-portfolio-viu.vercel.app/ICT2026-Flower-Classification-Research.docx",
    order: 1,
    isHidden: false,
  }
];

export const buildLocalProfile = () => defaultProfileSeed;
export const buildLocalProjects = () => defaultProjectsSeed;
export const buildLocalExperience = () => defaultExperienceSeed;
export const buildLocalActivities = () => defaultActivitiesSeed;
export const buildLocalResearch = () => defaultResearchSeed;
