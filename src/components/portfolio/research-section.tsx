"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, ArrowRight } from "lucide-react";
import type { PortfolioResearch } from "@/types/portfolio";
import { useLanguage } from "@/components/language-provider";

interface ResearchSectionProps {
  research: PortfolioResearch[];
}

export function ResearchSection({ research }: ResearchSectionProps) {
  const { t } = useLanguage();

  if (!research || research.length === 0) return null;

  return (
    <section id="research" className="section-padding relative overflow-hidden bg-muted/30 border-y border-border/40">
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("portfolio.research.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
            {t("portfolio.research.heading1")}<span className="text-gradient">{t("portfolio.research.heading2")}</span>
          </h2>
        </motion.div>

        <div className="space-y-8">
          {research.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover rounded-2xl p-6 md:p-8 flex flex-col relative group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                      {item.period}
                    </span>
                    <span className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      {item.authors.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 md:shrink-0">
                  {item.documentUrl && (
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-card border border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-colors text-muted-foreground"
                      title="View Document"
                    >
                      <FileText className="w-5 h-5" />
                    </a>
                  )}
                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="hidden md:inline font-medium text-sm">{t("portfolio.research.demo")}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("portfolio.research.abstract")}</h4>
                <p className="text-foreground leading-relaxed">
                  {item.abstract}
                </p>
              </div>

              {item.achievements && item.achievements.length > 0 && (
                <div className="mb-6 bg-muted/50 rounded-xl p-4 border border-border/40">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" /> {t("portfolio.research.achievements")}
                  </h4>
                  <ul className="space-y-2">
                    {item.achievements.map((ach, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-border/50">
                {item.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium border border-border/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
