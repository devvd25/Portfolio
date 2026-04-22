import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Github } from "lucide-react";

const socials = [
  { icon: Mail, label: "Email", value: "thanhphuochaya@gmail.com", href: "mailto:thanhphuochaya@gmail.com" },
  { icon: Phone, label: "Điện thoại", value: "0328 354 320", href: "tel:0328354320" },
  { icon: MapPin, label: "Địa chỉ", value: "33/4 Kiệt 53 Đào Tấn, Huế", href: null },
  { icon: Globe, label: "Website", value: "thanhphuochaya.site", href: "https://thanhphuochaya.site" },
  { icon: Github, label: "GitHub", value: "ThanhPhuocIT3905", href: "https://github.com/ThanhPhuocIT3905" },
];

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Liên <span className="text-gradient">hệ</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socials.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                {s.href ? (
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--glow-strong)] block"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="text-primary" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-medium truncate">{s.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="glass-card rounded-xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="text-primary" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-medium truncate">{s.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
