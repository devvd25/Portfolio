import { Github, Mail, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <a href="#" className="text-2xl font-extrabold text-gradient-bold">TP.DEV</a>
          <p className="text-sm text-muted-foreground mt-1">{t("footer.copyright")}</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/ThanhPhuocIT3905" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Github size={18} />
          </a>
          <a href="mailto:thanhphuochaya@gmail.com" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Mail size={18} />
          </a>
          <a href="https://thanhphuochaya.site" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Globe size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
