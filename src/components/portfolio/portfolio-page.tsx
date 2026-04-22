"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { ActivitiesSection } from "@/components/portfolio/activities-section";
import { ResearchSection } from "@/components/portfolio/research-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PortfolioProfile,
  PortfolioProject,
  SkillCategory,
  PortfolioExperience,
  PortfolioActivity,
  PortfolioResearch,
} from "@/types/portfolio";

interface PortfolioPageProps {
  profile: PortfolioProfile;
  projects: PortfolioProject[];
  skills: SkillCategory[];
  experience: PortfolioExperience[];
  activities: PortfolioActivity[];
  research: PortfolioResearch[];
}

const sectionMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

export function PortfolioPage({ profile, projects, skills, experience, activities, research }: PortfolioPageProps) {
  const { t, language } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,146,60,0.22),transparent_46%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_45%_95%,rgba(16,185,129,0.18),transparent_36%)]" />

      <header className="sticky top-0 z-30 border-b border-orange-100/60 bg-background/85 backdrop-blur-md dark:border-zinc-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#home" className="font-display text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            DevClay
          </a>

          <div className="hidden items-center gap-6 text-sm font-semibold text-zinc-700 md:flex dark:text-zinc-200">
            <a href="#about" className="transition hover:text-primary">
              {t("portfolio.nav.about")}
            </a>
            <a href="#experience" className="transition hover:text-primary">
              {t("portfolio.nav.experience") || "Experience"}
            </a>
            <a href="#skills" className="transition hover:text-primary">
              {t("portfolio.nav.skills")}
            </a>
            <a href="#projects" className="transition hover:text-primary">
              {t("portfolio.nav.projects")}
            </a>
            <a href="#research" className="transition hover:text-primary">
              {t("portfolio.nav.research") || "Research"}
            </a>
            <a href="#activities" className="transition hover:text-primary">
              {t("portfolio.nav.activities") || "Activities"}
            </a>
            <a href="#contact" className="transition hover:text-primary">
              {t("portfolio.nav.contact")}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <HeroSection profile={profile} />

        <motion.section
          id="about"
          {...sectionMotion}
          className="grid gap-6 border-t border-orange-100/80 py-20 lg:grid-cols-[1.1fr_0.9fr] dark:border-zinc-800"
        >
          <div className="space-y-6">
            <Badge className="from-sky-500 to-cyan-400">{t("portfolio.about.badge")}</Badge>
            <h2 className="font-display text-3xl font-black text-zinc-900 sm:text-4xl dark:text-zinc-50">
              {profile.headline[language]}
            </h2>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-200">
              {profile.bio[language]}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white/70 px-4 py-2 shadow-[0_10px_20px_rgba(249,115,22,0.14)] dark:border-zinc-700 dark:bg-zinc-900/70">
                <MapPin className="h-4 w-4 text-orange-500" />
                {profile.location[language]}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-white/70 px-4 py-2 shadow-[0_10px_20px_rgba(56,189,248,0.14)] dark:border-zinc-700 dark:bg-zinc-900/70">
                <Sparkles className="h-4 w-4 text-sky-500" />
                {profile.role[language]}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: t("portfolio.stats.years"), value: profile.stats?.years || "0+" },
              { label: t("portfolio.stats.projects"), value: profile.stats?.projects || "0+" },
              { label: t("portfolio.stats.countries"), value: profile.stats?.countries || "0" },
              { label: t("portfolio.stats.clientRating"), value: profile.stats?.reviews || "5.0" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/80 bg-gradient-to-br from-[#fff7ed] to-[#f1e2d1] p-5 shadow-[0_18px_34px_-16px_rgba(126,74,30,0.35)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <ExperienceSection experience={experience} />

        <motion.section id="skills" {...sectionMotion} className="space-y-8 py-20">
          <div className="space-y-4 text-center">
            <Badge>{t("portfolio.skills.badge")}</Badge>
            <h2 className="font-display text-3xl font-black text-zinc-900 sm:text-4xl dark:text-zinc-50">
              {t("portfolio.skills.heading")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {skills.map((skillCategory, index) => (
              <motion.article
                key={skillCategory.title[language]}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="glass-card-hover rounded-3xl p-6"
              >
                <h3 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {skillCategory.title[language]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {skillCategory.description[language]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillCategory.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-zinc-200 bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="projects" {...sectionMotion} className="space-y-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <Badge className="from-emerald-500 to-sky-500">{t("portfolio.projects.badge")}</Badge>
              <h2 className="font-display text-3xl font-black text-zinc-900 sm:text-4xl dark:text-zinc-50">
                {t("portfolio.projects.heading")}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <motion.article
                key={project.id}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group overflow-hidden rounded-3xl bold-card"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.imageUrl || profile.avatarUrl}
                    alt={project.title[language]}
                    width={1200}
                    height={800}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/55 via-zinc-900/0 to-transparent" />
                  {project.featured ? (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-bold text-white shadow-[0_8px_18px_rgba(249,115,22,0.4)]">
                      {t("portfolio.projects.featured")}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-4 p-5">
                  <h3 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {project.title[language]}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                    {project.summary[language]}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-xl")}
                      >
                        {t("portfolio.projects.live")}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl")}
                      >
                        {t("portfolio.projects.code")}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <ResearchSection research={research} />
        <ActivitiesSection activities={activities} />

        <motion.section id="contact" {...sectionMotion} className="py-20 border-t border-border/40">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#fff8ef] to-[#f2e5d5] p-8 shadow-[0_24px_42px_-20px_rgba(142,88,42,0.45)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 sm:p-10">
            <div className="space-y-5 text-center">
              <Badge className="from-orange-500 to-amber-400">{t("portfolio.contact.badge")}</Badge>
              <h2 className="font-display text-3xl font-black text-zinc-900 sm:text-4xl dark:text-zinc-50">
                {t("portfolio.contact.heading")}
              </h2>
              <p className="mx-auto max-w-2xl text-zinc-700 dark:text-zinc-200">
                {t("portfolio.contact.description")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a href={`mailto:${profile.email}`} className={buttonVariants({ size: "lg" })}>
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </a>
                {profile.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {t("portfolio.contact.github")}
                  </a>
                ) : null}
                {profile.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {t("portfolio.contact.linkedin")}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
