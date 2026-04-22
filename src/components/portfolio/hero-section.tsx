"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PortfolioProfile } from "@/types/portfolio";

interface HeroSectionProps {
  profile: PortfolioProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="home" className="grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        <Badge>{t("portfolio.badge.developerPortfolio")}</Badge>

        <div className="space-y-5">
          <h1 className="font-display text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl xl:text-6xl dark:text-zinc-50">
            {t("portfolio.hero.hello")}{" "}
            <span className="text-gradient">{profile.fullName}</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-200">
            {profile.headline}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            {profile.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants({ size: "lg" })}>
            {t("portfolio.hero.viewProjects")}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl")}
          >
            <Mail className="h-4 w-4" />
            {t("portfolio.hero.contactMe")}
          </a>
          {profile.githubUrl ? (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl")}
            >
              GitHub
            </a>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            t("portfolio.hero.card.productsShipped"),
            t("portfolio.hero.card.yearsReact"),
            t("portfolio.hero.card.openRemote"),
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_14px_28px_-18px_rgba(126,74,30,0.35)] dark:border-zinc-700 dark:bg-zinc-900/70"
            >
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {item}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.1 }}
        className="flex items-center justify-center lg:justify-end"
      >
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-orange-200/60 via-sky-200/40 to-emerald-200/40 blur-2xl dark:from-orange-500/10 dark:via-sky-500/10 dark:to-emerald-500/10" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-[0_22px_44px_-24px_rgba(121,74,40,0.5)] dark:border-zinc-700 dark:bg-zinc-900/75">
            <div className="relative h-[360px] w-[300px] overflow-hidden rounded-[1.6rem] sm:h-[420px] sm:w-[360px]">
              <Image
                src={profile.avatarUrl}
                alt={profile.fullName}
                fill
                sizes="(max-width: 640px) 300px, 360px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-7 left-7 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)]">
              {t("portfolio.hero.availableForFreelance")}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
