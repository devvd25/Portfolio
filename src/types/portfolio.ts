import type { JWTPayload } from "jose";

export type LocalizedString = {
  vi: string;
  en: string;
};

export interface PortfolioProfile {
  id: string;
  fullName: string;
  headline: LocalizedString;
  role: LocalizedString;
  location: LocalizedString;
  bio: LocalizedString;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  avatarUrl: string;
  cvUrl: string;
  stats: {
    years: string;
    projects: string;
    countries: string;
    reviews: string;
  };
}

export interface PortfolioProject {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  stack: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  isHidden: boolean;
}

export interface SkillCategory {
  title: LocalizedString;
  description: LocalizedString;
  items: string[];
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: LocalizedString;
  period: LocalizedString;
  tasks: LocalizedString[];
  techStack: string[];
  companyImageUrl: string;
  environmentImageUrl: string;
  order: number;
  isHidden: boolean;
}

export interface PortfolioOtherExperience {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  period: LocalizedString;
  imageUrl?: string;
  order: number;
  isHidden: boolean;
}

export interface PortfolioActivity {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  category: "community" | "workshop" | "qualification";
  date?: string;
  order: number;
  isHidden: boolean;
}

export interface PortfolioResearch {
  id: string;
  title: LocalizedString;
  period: LocalizedString;
  authors: string[];
  abstract: LocalizedString;
  technologies: string[];
  achievements: LocalizedString[];
  demoUrl: string;
  documentUrl: string;
  order: number;
  isHidden: boolean;
}

export interface AdminSession extends JWTPayload {
  sub: string;
  email: string;
  role: "admin";
}
