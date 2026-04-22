"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Briefcase, Minus } from "lucide-react";
import type { PortfolioExperience, PortfolioOtherExperience } from "@/types/portfolio";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";

interface ExperienceSectionProps {
  experience: PortfolioExperience[];
  otherExperience: PortfolioOtherExperience[];
}

export function ExperienceSection({ experience, otherExperience }: ExperienceSectionProps) {
  const { t, language } = useLanguage();

  const visibleWorkExp = (experience || []).filter(exp => !exp.isHidden);
  const visibleOtherExp = (otherExperience || []).filter(exp => !exp.isHidden);

  if (visibleWorkExp.length === 0 && visibleOtherExp.length === 0) return null;

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute top-40 left-[-10%] w-[40%] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {t("portfolio.experience.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
            {t("portfolio.experience.heading1")}
            <span className="text-gradient">{t("portfolio.experience.heading2")}</span>
          </h2>
        </motion.div>

        {/* WORK EXPERIENCE */}
        {visibleWorkExp.length > 0 && (
          <div className="mb-24">
            <h3 className="text-xl font-bold mb-10 text-primary/80 uppercase tracking-widest flex items-center gap-4">
              <span className="h-px w-8 bg-primary"></span>
              {t("admin.experience.type.work")}
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {visibleWorkExp.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card-hover rounded-3xl p-8 border border-white/50 bg-white/40 dark:bg-zinc-900/40 dark:border-zinc-800/50"
                >
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <div>
                      <h4 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-50 mb-2">
                        {exp.role[language]}
                      </h4>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span className="flex items-center gap-1">
                          <ChevronRight className="w-4 h-4" />
                          {exp.company}
                        </span>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 whitespace-nowrap">
                      {exp.period[language]}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {exp.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                        <p className="leading-relaxed text-sm">{task[language]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
                    {exp.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER EXPERIENCE */}
        {visibleOtherExp.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-10 text-zinc-400 uppercase tracking-widest flex items-center gap-4">
              <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700"></span>
              {t("admin.tab.otherExperience") || "Kinh nghiệm khác"}
            </h3>

            <div className="space-y-12">
              {visibleOtherExp.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row gap-6 md:gap-12 group"
                >
                  <div className="md:w-32 pt-1">
                    <span className="text-xl font-display font-bold text-primary/60 group-hover:text-primary transition-colors">
                      {exp.period[language]}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-2xl font-black font-display text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors">
                          {exp.title[language]}
                        </h4>
                        <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                          {exp.description[language]}
                        </p>
                      </div>
                      
                      {exp.imageUrl && (
                        <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-lg border border-white/50 group-hover:scale-[1.02] transition-transform duration-500">
                          <Image
                            src={exp.imageUrl}
                            alt={exp.title[language]}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-transparent dark:from-zinc-800 dark:via-zinc-900 dark:to-transparent" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
