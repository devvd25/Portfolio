import {
  FALLBACK_AVATAR_URL,
  defaultProfileSeed,
  defaultProjectsSeed,
  defaultExperienceSeed,
  defaultActivitiesSeed,
  defaultResearchSeed,
} from "@/lib/default-data";
import { PortfolioProfileModel } from "@/models/PortfolioProfile";
import { ProjectModel } from "@/models/Project";
import { ExperienceModel } from "@/models/Experience";
import { ActivityModel } from "@/models/Activity";
import { ResearchModel } from "@/models/Research";
import { OtherExperienceModel } from "@/models/OtherExperience";
import type { 
  PortfolioProfile, 
  PortfolioProject,
  PortfolioExperience,
  PortfolioOtherExperience,
  PortfolioActivity,
  PortfolioResearch,
  LocalizedString,
} from "@/types/portfolio";

import { connectToDatabase, isMongoConfigured } from "./db";

function ensureLocalized(value: any, fallback: string = ""): LocalizedString {
  if (value && typeof value === "object" && "vi" in value && "en" in value) {
    return value as LocalizedString;
  }
  const str = typeof value === "string" ? value : fallback;
  return { vi: str, en: str };
}

function ensureLocalizedArray(value: any): LocalizedString[] {
  if (Array.isArray(value)) {
    return value.map(item => ensureLocalized(item));
  }
  return [];
}

function buildLocalProfile(): PortfolioProfile {
  return {
    id: "local-profile",
    ...defaultProfileSeed,
  };
}

function buildLocalProjects(): PortfolioProject[] {
  return defaultProjectsSeed.map((project, index) => ({
    id: `local-project-${index + 1}`,
    ...project,
  }));
}

function buildLocalExperience(): PortfolioExperience[] {
  return defaultExperienceSeed.map((exp, index) => ({
    id: `local-exp-${index + 1}`,
    ...exp,
  }));
}

function buildLocalOtherExperience(): PortfolioOtherExperience[] {
  return []; // No default seeds for other experience yet
}

function buildLocalActivities(): PortfolioActivity[] {
  return defaultActivitiesSeed.map((act, index) => ({
    id: `local-act-${index + 1}`,
    ...act,
  }));
}

function buildLocalResearch(): PortfolioResearch[] {
  return defaultResearchSeed.map((res, index) => ({
    id: `local-res-${index + 1}`,
    ...res,
  }));
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
  };
}

async function ensureSeedData() {
  await connectToDatabase();

  const existingProfile = await PortfolioProfileModel.findOne({ key: "main" }).lean();

  if (!existingProfile) {
    // This is a fresh database, seed everything
    await PortfolioProfileModel.create({
      key: "main",
      ...defaultProfileSeed,
    });

    await ProjectModel.insertMany(
      defaultProjectsSeed.map((project, index) => ({
        ...project,
        order: project.order || index + 1,
      })),
    );

    await ExperienceModel.insertMany(defaultExperienceSeed);
    await ActivityModel.insertMany(defaultActivitiesSeed);
    await ResearchModel.insertMany(defaultResearchSeed);
    return;
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
