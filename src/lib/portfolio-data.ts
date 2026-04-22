import { ActivityModel } from "@/models/Activity";
import { ExperienceModel } from "@/models/Experience";
import { OtherExperienceModel } from "@/models/OtherExperience";
import { PortfolioProfileModel } from "@/models/Profile";
import { ProjectModel } from "@/models/Project";
import { ResearchModel } from "@/models/Research";
import type { 
  PortfolioProfile, 
  PortfolioProject, 
  PortfolioExperience, 
  PortfolioOtherExperience, 
  PortfolioActivity, 
  PortfolioResearch, 
  LocalizedString 
} from "@/types/portfolio";
import { 
  buildLocalProfile, 
  buildLocalProjects, 
  buildLocalExperience, 
  buildLocalOtherExperience, 
  buildLocalActivities, 
  buildLocalResearch 
} from "./default-data";
import { connectToDatabase, isMongoConfigured } from "./db";

const FALLBACK_AVATAR_URL = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

function ensureLocalized(val: any): LocalizedString {
  if (!val) return { vi: "", en: "" };
  if (typeof val === "string") return { vi: val, en: val };
  return {
    vi: val.vi || "",
    en: val.en || "",
  };
}

function ensureLocalizedArray(val: any): LocalizedString[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => ensureLocalized(item));
}

export function serializeProfile(profile: any): PortfolioProfile {
  return {
    id: String(profile._id),
    fullName: profile.fullName,
    headline: ensureLocalized(profile.headline),
    role: ensureLocalized(profile.role),
    location: ensureLocalized(profile.location),
    bio: ensureLocalized(profile.bio),
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

export function serializeProject(project: any): PortfolioProject {
  return {
    id: String(project._id),
    title: ensureLocalized(project.title),
    summary: ensureLocalized(project.summary),
    stack: project.stack,
    imageUrl: project.imageUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: Boolean(project.featured),
    order: project.order,
    isHidden: Boolean(project.isHidden),
  };
}

export function serializeExperience(doc: any): PortfolioExperience {
  return {
    id: String(doc._id),
    company: doc.company,
    role: ensureLocalized(doc.role),
    period: ensureLocalized(doc.period),
    tasks: ensureLocalizedArray(doc.tasks),
    techStack: doc.techStack,
    companyImageUrl: doc.companyImageUrl ?? "",
    environmentImageUrl: doc.environmentImageUrl ?? "",
    order: doc.order,
    isHidden: Boolean(doc.isHidden),
  };
}

export function serializeOtherExperience(doc: any): PortfolioOtherExperience {
  return {
    id: String(doc._id),
    title: ensureLocalized(doc.title),
    description: ensureLocalized(doc.description),
    period: ensureLocalized(doc.period),
    imageUrl: doc.imageUrl ?? "",
    order: doc.order,
    isHidden: Boolean(doc.isHidden),
  };
}

export function serializeActivity(doc: any): PortfolioActivity {
  return {
    id: String(doc._id),
    title: ensureLocalized(doc.title),
    description: ensureLocalized(doc.description),
    imageUrl: doc.imageUrl ?? "",
    category: doc.category,
    date: doc.date ?? "",
    order: doc.order,
    isHidden: Boolean(doc.isHidden),
  };
}

export function serializeResearch(doc: any): PortfolioResearch {
  return {
    id: String(doc._id),
    title: ensureLocalized(doc.title),
    period: ensureLocalized(doc.period),
    authors: doc.authors,
    abstract: ensureLocalized(doc.abstract),
    technologies: doc.technologies,
    achievements: ensureLocalizedArray(doc.achievements),
    demoUrl: doc.demoUrl ?? "",
    documentUrl: doc.documentUrl ?? "",
    order: doc.order,
    isHidden: Boolean(doc.isHidden),
  };
}

async function ensureSeedData() {
  const profileCount = await PortfolioProfileModel.countDocuments();
  if (profileCount === 0) {
    await PortfolioProfileModel.create({ key: "main", ...buildLocalProfile() });
  }

  const projectCount = await ProjectModel.countDocuments();
  if (projectCount === 0) {
    const localProjects = buildLocalProjects();
    await ProjectModel.insertMany(localProjects);
  }

  const expCount = await ExperienceModel.countDocuments();
  if (expCount === 0) {
    const localExp = buildLocalExperience();
    await ExperienceModel.insertMany(localExp);
  }

  const actCount = await ActivityModel.countDocuments();
  if (actCount === 0) {
    const localAct = buildLocalActivities();
    await ActivityModel.insertMany(localAct);
  }

  const resCount = await ResearchModel.countDocuments();
  if (resCount === 0) {
    const localRes = buildLocalResearch();
    await ResearchModel.insertMany(localRes);
  }
}

export async function getPortfolioSnapshot() {
  if (!isMongoConfigured()) {
    return {
      profile: buildLocalProfile(),
      projects: buildLocalProjects(),
      experience: buildLocalExperience(),
      otherExperience: buildLocalOtherExperience(),
      activities: buildLocalActivities(),
      research: buildLocalResearch(),
      source: "fallback" as const,
    };
  }

  try {
    await connectToDatabase();
    await ensureSeedData();

    const [profileDoc, projectDocs, expDocs, otherExpDocs, actDocs, resDocs] = await Promise.all([
      PortfolioProfileModel.findOne({ key: "main" }).lean(),
      ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      ExperienceModel.find().sort({ order: 1 }).lean(),
      OtherExperienceModel.find().sort({ order: 1 }).lean(),
      ActivityModel.find().sort({ category: 1, order: 1 }).lean(),
      ResearchModel.find().sort({ order: 1 }).lean(),
    ]);

    if (!profileDoc) {
      return {
        profile: buildLocalProfile(),
        projects: buildLocalProjects(),
        experience: buildLocalExperience(),
        otherExperience: buildLocalOtherExperience(),
        activities: buildLocalActivities(),
        research: buildLocalResearch(),
        source: "fallback" as const,
      };
    }

    return {
      profile: serializeProfile(profileDoc),
      projects: projectDocs.map(serializeProject),
      experience: expDocs.map(serializeExperience),
      otherExperience: otherExpDocs.map(serializeOtherExperience),
      activities: actDocs.map(serializeActivity),
      research: resDocs.map(serializeResearch),
      source: "database" as const,
    };
  } catch (error) {
    console.error("Snapshot fetch error:", error);
    return {
      profile: buildLocalProfile(),
      projects: buildLocalProjects(),
      experience: buildLocalExperience(),
      otherExperience: buildLocalOtherExperience(),
      activities: buildLocalActivities(),
      research: buildLocalResearch(),
      source: "fallback" as const,
    };
  }
}
