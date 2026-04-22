"use client";

import { motion } from "framer-motion";
import { Users, HeartHandshake, Lightbulb } from "lucide-react";
import type { PortfolioActivity } from "@/types/portfolio";
import { useLanguage } from "@/components/language-provider";
import Image from "next/image";

interface ActivitiesSectionProps {
  activities: PortfolioActivity[];
}

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  const { t, language } = useLanguage();

  if (!activities || activities.length === 0) return null;

  return (
    <section id="activities" className="section-padding relative">
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="section-label flex items-center justify-center gap-2">
            <HeartHandshake className="w-4 h-4" />
            {t("portfolio.activities.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
            {t("portfolio.activities.heading1")} <span className="text-gradient">{t("portfolio.activities.heading2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("portfolio.activities.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bold-card rounded-2xl overflow-hidden group flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                {activity.imageUrl ? (
                  <Image
                    src={activity.imageUrl}
                    alt={activity.title[language]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="img-placeholder w-full h-full">
                    {activity.category === "workshop" ? (
                      <Lightbulb className="w-12 h-12 opacity-20" />
                    ) : (
                      <HeartHandshake className="w-12 h-12 opacity-20" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-full text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    {activity.category === "workshop" ? (
                      <Lightbulb className="w-3 h-3" />
                    ) : (
                      <HeartHandshake className="w-3 h-3" />
                    )}
                    {activity.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold font-display mb-3 group-hover:text-primary transition-colors">
                  {activity.title[language]}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {activity.description[language]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
