import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "vi" | "en" | "ja";

type Translations = {
  [key: string]: {
    vi: string;
    en: string;
    ja: string;
  };
};

const translations: Translations = {
  // Navbar
  "nav.about": { vi: "Giới thiệu", en: "About", ja: "紹介" },
  "nav.experience": { vi: "Kinh nghiệm", en: "Experience", ja: "経験" },
  "nav.skills": { vi: "Kỹ năng", en: "Skills", ja: "スキル" },
  "nav.projects": { vi: "Dự án", en: "Projects", ja: "プロジェクト" },
  "nav.activities": { vi: "Hoạt động", en: "Activities", ja: "活動" },
  "nav.research": { vi: "Nghiên cứu", en: "Research", ja: "研究" },

  // Hero
  "hero.label": { vi: "Portfolio 2026", en: "Portfolio 2026", ja: "ポートフォリオ 2026" },
  "hero.greeting": { vi: "Xin chào,", en: "Hello,", ja: "こんにちは、" },
  "hero.iam": { vi: "tôi là", en: "I'm", ja: "私は" },
  "hero.name": { vi: "Phước", en: "Phuoc", ja: "フック" },
  "hero.description": {
    vi: "Web Developer — Sinh viên năm 3 CNTT tại Đại học Đông Á. Đam mê xây dựng ứng dụng web hiện đại với ReactJS & Spring Boot.",
    en: "Web Developer — 3rd-year IT student at Dong A University. Passionate about building modern web applications with ReactJS & Spring Boot.",
    ja: "Web開発者 — ドンア大学IT学部3年生。ReactJSとSpring Bootを使ったモダンなWebアプリケーション開発に情熱を持っています。",
  },
  "hero.myProjects": { vi: "Dự án của tôi", en: "My Projects", ja: "プロジェクト" },
  "hero.downloadCV": { vi: "Tải CV", en: "Download CV", ja: "履歴書DL" },
  "hero.openToWork": { vi: "🚀 Open to work", en: "🚀 Open to work", ja: "🚀 求職中" },
  "hero.webDev": { vi: "⚡ Web Developer", en: "⚡ Web Developer", ja: "⚡ Web開発者" },
  "hero.scroll": { vi: "Scroll", en: "Scroll", ja: "スクロール" },

  // About
  "about.label": { vi: "01 — Giới thiệu", en: "01 — About", ja: "01 — 紹介" },
  "about.title1": { vi: "Về", en: "About", ja: "自己" },
  "about.title2": { vi: "bản thân", en: "me", ja: "紹介" },
  "about.university": { vi: "Đại học Đông Á", en: "Dong A University", ja: "ドンア大学" },
  "about.major": { vi: "Công nghệ thông tin", en: "Information Technology", ja: "情報技術" },
  "about.eduDesc": {
    vi: "Sinh viên chuyên ngành CNTT với nền tảng vững chắc về OOP, Cấu trúc dữ liệu & Giải thuật. Có kinh nghiệm thực hành phát triển ứng dụng web qua các dự án thực tế.",
    en: "IT student with a solid foundation in OOP, Data Structures & Algorithms. Hands-on experience in web development through real-world projects.",
    ja: "OOP、データ構造とアルゴリズムの確かな基礎を持つIT学生。実際のプロジェクトを通じたWeb開発の実践経験があります。",
  },
  "about.careerGoal": { vi: "Mục tiêu nghề nghiệp", en: "Career Goal", ja: "キャリア目標" },
  "about.careerDesc": {
    vi: "Hướng tới vai trò Web/Mobile/Backend Developer. Đam mê thiết kế UI/UX thân thiện, xây dựng hệ thống có khả năng mở rộng và hiệu suất cao.",
    en: "Aiming for Web/Mobile/Backend Developer roles. Passionate about user-friendly UI/UX, building scalable and high-performance systems.",
    ja: "Web/Mobile/Backendデベロッパーを目指しています。ユーザーフレンドリーなUI/UX設計、スケーラブルで高性能なシステム構築に情熱を持っています。",
  },
  "about.languages": { vi: "Ngôn ngữ", en: "Languages", ja: "言語" },
  "about.english": { vi: "Tiếng Anh", en: "English", ja: "英語" },
  "about.englishLevel": { vi: "Đọc tài liệu", en: "Reading docs", ja: "ドキュメント読解" },
  "about.japanese": { vi: "Tiếng Nhật", en: "Japanese", ja: "日本語" },

  // Experience
  "exp.label": { vi: "02 — Kinh nghiệm", en: "02 — Experience", ja: "02 — 経験" },
  "exp.title1": { vi: "Nơi tôi đã", en: "Where I", ja: "私の" },
  "exp.title2": { vi: "làm việc", en: "worked", ja: "職歴" },
  "exp.company": { vi: "Công ty Ikigai", en: "Ikigai Company", ja: "Ikigai社" },
  "exp.role": { vi: "Web Developer Intern → Web Developer", en: "Web Developer Intern → Web Developer", ja: "Webデベロッパーインターン → Webデベロッパー" },
  "exp.task1": {
    vi: "Thiết kế và triển khai website sử dụng PHP/WordPress kết hợp React để tối ưu hóa UX.",
    en: "Designed and implemented websites using PHP/WordPress combined with React for optimized UX.",
    ja: "PHP/WordPressとReactを組み合わせてUXを最適化したWebサイトの設計・実装。",
  },
  "exp.task2": {
    vi: "Xây dựng React Components tái sử dụng, tùy chỉnh Theme/Plugins theo yêu cầu kỹ thuật.",
    en: "Built reusable React Components, customized Themes/Plugins per technical requirements.",
    ja: "再利用可能なReactコンポーネントの構築、技術要件に応じたテーマ/プラグインのカスタマイズ。",
  },
  "exp.task3": {
    vi: "Tối ưu hóa SEO On-page giúp cải thiện thứ hạng trang web trên các công cụ tìm kiếm.",
    en: "Optimized on-page SEO to improve website rankings on search engines.",
    ja: "オンページSEOの最適化により、検索エンジンでのWebサイトランキングを改善。",
  },
  "exp.task4": {
    vi: "Sử dụng Git quản lý mã nguồn, phối hợp theo mô hình Agile và deploy sản phẩm.",
    en: "Used Git for source control, collaborated using Agile methodology and deployed products.",
    ja: "Gitによるソースコード管理、アジャイル手法での協業と製品デプロイ。",
  },
  "exp.task5": {
    vi: "Đảm bảo Responsive Design và kiểm soát tốc độ tải trang.",
    en: "Ensured Responsive Design and optimized page load speed.",
    ja: "レスポンシブデザインの確保とページ読み込み速度の最適化。",
  },

  // Skills
  "skills.label": { vi: "03 — Kỹ năng", en: "03 — Skills", ja: "03 — スキル" },
  "skills.title1": { vi: "Công nghệ", en: "Technologies", ja: "使用" },
  "skills.title2": { vi: "tôi sử dụng", en: "I use", ja: "技術" },
  "skills.languages": { vi: "Ngôn ngữ", en: "Languages", ja: "言語" },
  "skills.frontend": { vi: "Frontend", en: "Frontend", ja: "フロントエンド" },
  "skills.backend": { vi: "Backend", en: "Backend", ja: "バックエンド" },
  "skills.database": { vi: "Database", en: "Database", ja: "データベース" },
  "skills.tools": { vi: "Công cụ", en: "Tools", ja: "ツール" },
  "skills.soft": { vi: "Kỹ năng mềm", en: "Soft Skills", ja: "ソフトスキル" },
  "skills.softItems": {
    vi: "Giao tiếp,Làm việc nhóm,Quản lý thời gian",
    en: "Communication,Teamwork,Time Management",
    ja: "コミュニケーション,チームワーク,時間管理",
  },

  // Projects
  "proj.label": { vi: "04 — Dự án", en: "04 — Projects", ja: "04 — プロジェクト" },
  "proj.title1": { vi: "Dự án", en: "Featured", ja: "注目の" },
  "proj.title2": { vi: "nổi bật", en: "projects", ja: "プロジェクト" },
  "proj.robot.title": { vi: "Robot di động gắp vật thể", en: "Mobile Object-Grabbing Robot", ja: "移動物体把持ロボット" },
  "proj.robot.desc": {
    vi: "Thiết kế cấu trúc cơ khí và lập trình thuật toán điều khiển giúp robot di chuyển, định vị và thao tác vật thể chính xác.",
    en: "Designed mechanical structure and programmed control algorithms for robot movement, positioning, and precise object manipulation.",
    ja: "ロボットの移動、位置決め、正確な物体操作のための機械構造設計と制御アルゴリズムのプログラミング。",
  },
  "proj.ecommerce.desc": {
    vi: "Ứng dụng thương mại điện tử với giao diện người dùng đơn giản, dễ nhìn và trực quan, tối ưu trải nghiệm người dùng.",
    en: "E-commerce application with a clean, intuitive user interface, optimized for user experience.",
    ja: "クリーンで直感的なユーザーインターフェースを備えたECアプリケーション。UXに最適化。",
  },
  "proj.school.desc": {
    vi: "Hệ thống quản lý trường học với vai trò Admin, Giáo viên và Học sinh. Frontend deploy trên Vercel, Backend trên Render.",
    en: "School management system with Admin, Teacher, and Student roles. Frontend on Vercel, Backend on Render.",
    ja: "管理者、教師、学生の役割を持つ学校管理システム。フロントエンドはVercel、バックエンドはRenderにデプロイ。",
  },
  "proj.flower.desc": {
    vi: "Hệ thống nhận diện và phân loại hoa sử dụng thuật toán SVM kết hợp với các kỹ thuật trích xuất đặc trưng hình ảnh tiên tiến.",
    en: "Flower recognition and classification system using SVM algorithm combined with advanced image feature extraction techniques.",
    ja: "SVM アルゴリズムと高度な画像特徴抽出技術を組み合わせた花の認識・分類システム。",
  },
  "proj.demoImage": { vi: "Ảnh demo dự án", en: "Project demo image", ja: "プロジェクトデモ画像" },

  // Activities
  "act.label": { vi: "05 — Hoạt động", en: "05 — Activities", ja: "05 — 活動" },
  "act.title1": { vi: "Hoạt động", en: "Extracurricular", ja: "課外" },
  "act.title2": { vi: "ngoại khoá", en: "activities", ja: "活動" },
  "act.community": { vi: "Hoạt động cộng đồng", en: "Community Service", ja: "コミュニティ活動" },
  "act.workshops": { vi: "Hội thảo & Phát triển chuyên môn", en: "Workshops & Professional Development", ja: "ワークショップ＆専門能力開発" },
  "act.viewImage": { vi: "Xem ảnh lớn", en: "View full image", ja: "拡大表示" },
  "act.beach.title": { vi: "Beach Cleanup Activity", en: "Beach Cleanup Activity", ja: "ビーチクリーンアップ活動" },
  "act.beach.desc": {
    vi: "Đóng góp vào hoạt động bảo vệ môi trường thông qua việc dọn dẹp bãi biển.",
    en: "Contributing to environmental protection through beach cleanup activities.",
    ja: "ビーチクリーンアップ活動を通じた環境保護への貢献。",
  },
  "act.museum.title": { vi: "Da Nang Museum Visit", en: "Da Nang Museum Visit", ja: "ダナン博物館訪問" },
  "act.museum.desc": {
    vi: "Tham gia chuyến tham quan văn hóa và giáo dục tại Bảo tàng Đà Nẵng.",
    en: "Participated in a cultural and educational visit to Da Nang Museum.",
    ja: "ダナン博物館での文化教育訪問に参加。",
  },
  "act.digital.title": { vi: "Digital Transformation Conference", en: "Digital Transformation Conference", ja: "デジタルトランスフォーメーション会議" },
  "act.digital.desc": {
    vi: 'Tham dự hội thảo khoa học "Tăng cường Chuyển đổi Số tại Đà Nẵng".',
    en: 'Attended the scientific conference "Enhancing Digital Transformation in Da Nang".',
    ja: '「ダナンにおけるデジタルトランスフォーメーション強化」科学会議に参加。',
  },
  "act.schooltour.title": { vi: "School Tour: Ready for AI 2025", en: "School Tour: Ready for AI 2025", ja: "スクールツアー：AI 2025に向けて" },
  "act.schooltour.desc": {
    vi: 'Tham dự hội thảo "School Tour: Ready for AI 2025", do Sở KH&CN Đà Nẵng tài trợ.',
    en: 'Attended "School Tour: Ready for AI 2025" workshop, sponsored by Da Nang Dept. of Science & Technology.',
    ja: 'ダナン科学技術局主催の「スクールツアー：AI 2025に向けて」ワークショップに参加。',
  },
  "act.cardano.title": { vi: "Vietnam University Cardano Workshop", en: "Vietnam University Cardano Workshop", ja: "ベトナム大学カルダノワークショップ" },
  "act.cardano.desc": {
    vi: "Tham dự Workshop & Onboarding của Vietnam University Cardano.",
    en: "Attended the Workshop & Onboarding of Vietnam University Cardano.",
    ja: "ベトナム大学カルダノのワークショップ＆オンボーディングに参加。",
  },

  // Research
  "res.label": { vi: "06 — Nghiên cứu", en: "06 — Research", ja: "06 — 研究" },
  "res.title1": { vi: "Nghiên cứu", en: "Scientific", ja: "科学" },
  "res.title2": { vi: "khoa học", en: "research", ja: "研究" },
  "res.authors": { vi: "Tác giả:", en: "Authors:", ja: "著者：" },
  "res.abstract": { vi: "Tóm tắt:", en: "Abstract:", ja: "概要：" },
  "res.abstractText": {
    vi: "Hệ thống nhận diện hoa tiên tiến sử dụng EfficientNetB0 kết hợp Transfer Learning và Grad-CAM. Thực nghiệm trên 4.317 ảnh thuộc 5 loài hoa cho thấy độ chính xác 96.45%, vượt xa SVM truyền thống (53.67%).",
    en: "Advanced flower recognition system using EfficientNetB0 with Transfer Learning and Grad-CAM. Experiments on 4,317 images of 5 flower species achieved 96.45% accuracy, far surpassing traditional SVM (53.67%).",
    ja: "EfficientNetB0とTransfer Learning、Grad-CAMを使用した高度な花認識システム。5種の花4,317枚の画像での実験で96.45%の精度を達成し、従来のSVM（53.67%）を大幅に上回りました。",
  },
  "res.achievements": { vi: "Thành tựu:", en: "Achievements:", ja: "成果：" },
  "res.ach1": {
    vi: "Đạt độ chính xác phân loại 96.45% với kiến trúc EfficientNetB0",
    en: "Achieved 96.45% classification accuracy with EfficientNetB0 architecture",
    ja: "EfficientNetB0アーキテクチャで96.45%の分類精度を達成",
  },
  "res.ach2": {
    vi: "Triển khai Grad-CAM để trực quan hóa minh bạch quyết định của AI",
    en: "Implemented Grad-CAM for transparent AI decision visualization",
    ja: "Grad-CAMによるAI判断の透明な可視化を実装",
  },
  "res.ach3": {
    vi: "Triển khai giao diện web tương tác với suy luận thời gian thực",
    en: "Deployed interactive web interface with real-time inference",
    ja: "リアルタイム推論を備えたインタラクティブWebインターフェースをデプロイ",
  },
  "res.ach4": {
    vi: "Cải thiện 42% hiệu suất so với phương pháp SVM truyền thống",
    en: "42% performance improvement over traditional SVM method",
    ja: "従来のSVM手法と比較して42%の性能向上",
  },
  "res.liveDemo": { vi: "Live Demo", en: "Live Demo", ja: "ライブデモ" },
  "res.viewDoc": { vi: "Xem tài liệu", en: "View Document", ja: "資料を見る" },

  // CV
  "cv.title1": { vi: "CV", en: "My", ja: "私の" },
  "cv.title2": { vi: "của tôi", en: "CV", ja: "履歴書" },
  "cv.download": { vi: "Tải CV", en: "Download CV", ja: "履歴書DL" },
  "cv.openTab": { vi: "Mở tab mới", en: "Open in new tab", ja: "新しいタブで開く" },
  "cv.fileTitle": { vi: "CV - Nguyễn Thanh Phước", en: "CV - Nguyen Thanh Phuoc", ja: "履歴書 - グエン・タン・フック" },

  // Footer
  "footer.copyright": { vi: "© 2025 Nguyễn Thanh Phước", en: "© 2025 Nguyen Thanh Phuoc", ja: "© 2025 グエン・タン・フック" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    return (saved as Language) || "vi";
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.vi;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
