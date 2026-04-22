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
import type { 
  PortfolioProfile, 
  PortfolioProject,
  PortfolioExperience,
  PortfolioActivity,
  PortfolioResearch,
} from "@/types/portfolio";

import { connectToDatabase, isMongoConfigured } from "./db";

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

function serializeProfile(profile: {
  _id: unknown;
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  cvUrl?: string;
}): PortfolioProfile {
  return {
    id: String(profile._id),
    fullName: profile.fullName,
    headline: profile.headline,
    location: profile.location,
    bio: profile.bio,
    email: profile.email,
    githubUrl: profile.githubUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    avatarUrl: profile.avatarUrl || FALLBACK_AVATAR_URL,
    cvUrl: profile.cvUrl ?? "",
  };
}

function serializeProject(project: {
  _id: unknown;
  title: string;
  summary: string;
  stack: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  order: number;
}): PortfolioProject {
  return {
    id: String(project._id),
    title: project.title,
    summary: project.summary,
    stack: project.stack,
    imageUrl: project.imageUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: Boolean(project.featured),
    order: project.order,
  };
}

function serializeExperience(doc: any): PortfolioExperience {
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

function serializeActivity(doc: any): PortfolioActivity {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl ?? "",
    category: doc.category,
    order: doc.order,
  };
}

function serializeResearch(doc: any): PortfolioResearch {
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

async function ensureSeedData() {
  await connectToDatabase();

  const existingProfile = await PortfolioProfileModel.findOne({ key: "main" }).lean();

  if (!existingProfile) {
    await PortfolioProfileModel.create({
      key: "main",
      ...defaultProfileSeed,
    });
  }

  const projectCount = await ProjectModel.estimatedDocumentCount();

  if (projectCount === 0) {
    await ProjectModel.insertMany(
      defaultProjectsSeed.map((project, index) => ({
        ...project,
        order: project.order || index + 1,
      })),
    );
  }

  const expCount = await ExperienceModel.estimatedDocumentCount();
  if (expCount === 0) {
    await ExperienceModel.insertMany(defaultExperienceSeed);
  }

  const actCount = await ActivityModel.estimatedDocumentCount();
  if (actCount === 0) {
    await ActivityModel.insertMany(defaultActivitiesSeed);
  }

  const resCount = await ResearchModel.estimatedDocumentCount();
  if (resCount === 0) {
    await ResearchModel.insertMany(defaultResearchSeed);
  }
}

export async function getPortfolioSnapshot() {
  if (!isMongoConfigured()) {
    return {
      profile: buildLocalProfile(),
      projects: buildLocalProjects(),
      experience: buildLocalExperience(),
      activities: buildLocalActivities(),
      research: buildLocalResearch(),
      source: "fallback" as const,
    };
  }

  try {
    await ensureSeedData();

    const [profileDoc, projectDocs, expDocs, actDocs, resDocs] = await Promise.all([
      PortfolioProfileModel.findOne({ key: "main" }).lean(),
      ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      ExperienceModel.find().sort({ order: 1 }).lean(),
      ActivityModel.find().sort({ category: 1, order: 1 }).lean(),
      ResearchModel.find().sort({ order: 1 }).lean(),
    ]);

    if (!profileDoc) {
      return {
        profile: buildLocalProfile(),
        projects: buildLocalProjects(),
        experience: buildLocalExperience(),
        activities: buildLocalActivities(),
        research: buildLocalResearch(),
        source: "fallback" as const,
      };
    }

    return {
      profile: serializeProfile(profileDoc),
      projects: projectDocs.map(serializeProject),
      experience: expDocs.map(serializeExperience),
      activities: actDocs.map(serializeActivity),
      research: resDocs.map(serializeResearch),
      source: "database" as const,
    };
  } catch {
    return {
      profile: buildLocalProfile(),
      projects: buildLocalProjects(),
      experience: buildLocalExperience(),
      activities: buildLocalActivities(),
      research: buildLocalResearch(),
      source: "fallback" as const,
    };
  }
}
