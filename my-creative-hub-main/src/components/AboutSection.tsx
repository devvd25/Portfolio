import { motion } from "framer-motion";
import { GraduationCap, Target, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="section-label">{t("about.label")}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
            {t("about.title1")} <span className="text-gradient-bold">{t("about.title2")}</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bold-card rounded-2xl p-7 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <GraduationCap size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t("about.university")}</h3>
                <p className="text-sm text-primary font-medium">{t("about.major")}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">2023 — 2027</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("about.eduDesc")}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bold-card rounded-2xl p-7 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Target size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg">{t("about.careerGoal")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("about.careerDesc")}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bold-card rounded-2xl p-7 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Languages size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg">{t("about.languages")}</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t("about.english")}</span>
                    <span className="text-primary font-mono text-xs">{t("about.englishLevel")}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-primary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t("about.japanese")}</span>
                    <span className="text-primary font-mono text-xs">N5</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
