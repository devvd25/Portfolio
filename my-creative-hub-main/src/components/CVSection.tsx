// Đã xóa component CVSection theo yêu cầu người dùng.

// import { motion } from "framer-motion";
// import { FileText, Download, ExternalLink } from "lucide-react";
// const CVSection = () => { ... }
// export default CVSection;
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";

const CVSection = () => {
  const cvUrl = "/cv/CV_Nguyen_Thanh_Phuoc.pdf";

  return (
    <section id="cv" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            CV <span className="text-gradient">của tôi</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-6" />

          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={cvUrl}
              download
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={16} /> Tải CV
            </a>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-lg text-sm font-medium hover:border-primary/50 transition-all"
            >
              <ExternalLink size={16} /> Mở tab mới
            </a>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
              <FileText size={16} className="text-primary" />
              <span className="text-sm font-medium">CV - Nguyễn Thanh Phước</span>
            </div>
            <div className="w-full" style={{ height: "80vh" }}>
              <iframe
                src={cvUrl}
                title="CV Nguyễn Thanh Phước"
                className="w-full h-full border-0"
                style={{ background: "hsl(var(--muted))" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CVSection;
