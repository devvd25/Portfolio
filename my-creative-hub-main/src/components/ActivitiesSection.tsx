import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lightbulb, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ActivitiesSection = () => {
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const communityActivities = [
    { title: t("act.beach.title"), description: t("act.beach.desc"), image: "/activities/beach-cleanup.png" },
    { title: t("act.museum.title"), description: t("act.museum.desc"), image: "/activities/museum-visit.png" },
  ];

  const workshopActivities = [
    { title: t("act.digital.title"), description: t("act.digital.desc"), image: "/activities/digital-transformation.png" },
    { title: t("act.schooltour.title"), description: t("act.schooltour.desc"), image: "/activities/school-tour-ai.png" },
    { title: t("act.cardano.title"), description: t("act.cardano.desc"), image: "/activities/cardano-workshop.png" },
  ];

  return (
    <section id="activities" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="section-label">{t("act.label")}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
            {t("act.title1")} <span className="text-gradient-bold">{t("act.title2")}</span>
          </h2>

          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("act.community")}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {communityActivities.map((act, idx) => (
                <motion.div key={act.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bold-card rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setLightbox(act.image)}>
                  <div className="relative overflow-hidden">
                    <img src={act.image} alt={act.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-sm">
                      <span className="text-sm font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-xl">{t("act.viewImage")}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold mb-1">{act.title}</h4>
                    <p className="text-sm text-muted-foreground">{act.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Lightbulb size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">{t("act.workshops")}</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {workshopActivities.map((act, idx) => (
                <motion.div key={act.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bold-card rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setLightbox(act.image)}>
                  <div className="relative overflow-hidden">
                    <img src={act.image} alt={act.title} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-sm">
                      <span className="text-sm font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-xl">{t("act.viewImage")}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-sm mb-1">{act.title}</h4>
                    <p className="text-xs text-muted-foreground">{act.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:text-primary transition-colors">
              <X size={24} />
            </button>
            <motion.img initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} src={lightbox} alt="Activity" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ActivitiesSection;
