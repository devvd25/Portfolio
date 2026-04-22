import type { JWTPayload } from "jose";

export interface PortfolioProfile {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  avatarUrl: string;
  cvUrl: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
}

export interface SkillCategory {
  title: string;
  description: string;
  items: string[];
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  tasks: string[];
  techStack: string[];
  companyImageUrl: string;
  environmentImageUrl: string;
  order: number;
}

export interface PortfolioActivity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "community" | "workshop";
  order: number;
}

export interface PortfolioResearch {
  id: string;
  title: string;
  period: string;
  authors: string[];
  abstract: string;
  technologies: string[];
  achievements: string[];
  demoUrl: string;
  documentUrl: string;
  order: number;
}

export interface AdminSession extends JWTPayload {
  sub: string;
  email: string;
  role: "admin";
}
