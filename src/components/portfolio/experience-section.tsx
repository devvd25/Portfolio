"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Briefcase } from "lucide-react";
import type { PortfolioExperience } from "@/types/portfolio";
import { useLanguage } from "@/components/language-provider";

interface ExperienceSectionProps {
  experience: PortfolioExperience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const { t } = useLanguage();

  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Decorative blobs */}
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-2rem] top-2 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary hidden md:block" />
              {/* Timeline line */}
              {index !== experience.length - 1 && (
                <div className="absolute left-[-1.5rem] top-8 bottom-[-4rem] w-[2px] bg-border/50 hidden md:block" />
              )}

              <div className="glass-card-hover rounded-2xl p-8 h-full flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-foreground mb-2">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span className="flex items-center gap-1">
                        <ChevronRight className="w-4 h-4" />
                        {exp.company}
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                <div className="space-y-4 flex-grow mb-8">
                  {exp.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{task}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-border/50">
                  {exp.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
