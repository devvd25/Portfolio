import { motion } from "framer-motion";
import { ExternalLink, Github, Bot, ShoppingCart, School, Flower2, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProjectsSection = () => {
  const { t } = useLanguage();

  const projects = [
    {
      icon: Bot,
      title: t("proj.robot.title"),
      period: "Robotech 2024",
      description: t("proj.robot.desc"),
      tech: ["Arduino", "C++", "Cơ khí"],
      source: null as string | null,
      image: "/activities/robot-demo.jpg",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Website",
      period: "07/2025 — 08/2025",
      description: t("proj.ecommerce.desc"),
      tech: ["ReactJS", "Spring Boot", "SQL Server"],
      source: "https://github.com/IsaacSmith2005/ecomerce-project.git",
      image: "/activities/ecommerce-demo.png",
    },
    {
      icon: School,
      title: "School Management System",
      period: "2025 — 2026",
      description: t("proj.school.desc"),
      tech: ["ReactJS", "Node.js", "MongoDB"],
      source: "https://github.com/ViuGiaLai/classroom-management-system.git",
      image: "/activities/school-demo.png",
    },
    {
      icon: Flower2,
      title: "Flower Recognition System",
      period: "2025 — 2026",
      description: t("proj.flower.desc"),
      tech: ["ReactJS", "Python", "OpenCV", "Scikit-learn"],
      source: "https://github.com/ViuGiaLai/efficientNetB0_and_grad-cam",
      image: "/activities/flowers-demo.png",
    },
  ];

  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="section-label">{t("proj.label")}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
            {t("proj.title1")} <span className="text-gradient-bold">{t("proj.title2")}</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <motion.div key={project.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bold-card rounded-2xl overflow-hidden group flex flex-col">
                <div className="aspect-video img-placeholder relative overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-center space-y-2 relative z-10">
                      <ImageIcon size={36} className="mx-auto opacity-40" />
                      <p className="text-xs opacity-60">{t("proj.demoImage")}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <project.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={20} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{project.period}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono">{tech}</span>
                    ))}
                  </div>
                  {project.source && (
                    <a href={project.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline w-fit font-medium">
                      <Github size={16} /> Source Code <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
