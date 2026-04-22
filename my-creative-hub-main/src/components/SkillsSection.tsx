import { motion } from "framer-motion";
import { Code2, Server, Database, Wrench, Users, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SkillsSection = () => {
  const { t } = useLanguage();

  const categories = [
    { icon: Code2, title: t("skills.languages"), items: ["Java", "Python", "JavaScript (ES6+)", "TypeScript"], color: "from-blue-500 to-cyan-500" },
    { icon: Sparkles, title: t("skills.frontend"), items: ["HTML5", "CSS3", "ReactJS", "TailwindCSS", "Flutter"], color: "from-violet-500 to-purple-500" },
    { icon: Server, title: t("skills.backend"), items: ["Java Spring Boot", "Node.js (Express)", "RESTful API", "JWT"], color: "from-emerald-500 to-teal-500" },
    { icon: Database, title: t("skills.database"), items: ["Microsoft SQL Server", "MongoDB"], color: "from-orange-500 to-amber-500" },
    { icon: Wrench, title: t("skills.tools"), items: ["Git/GitHub", "Postman", "Docker"], color: "from-rose-500 to-pink-500" },
    { icon: Users, title: t("skills.soft"), items: t("skills.softItems").split(","), color: "from-sky-500 to-indigo-500" },
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="section-label">{t("skills.label")}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
            {t("skills.title1")} <span className="text-gradient-bold">{t("skills.title2")}</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="bold-card rounded-2xl p-6 group">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <cat.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className="text-xs px-3 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
