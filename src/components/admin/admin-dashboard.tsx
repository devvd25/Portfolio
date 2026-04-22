"use client";

import { LogOut, Plus, Save, Trash2, UploadCloud, User, Briefcase, Star, Layout, MessageSquare, BookOpen, Pencil, ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseStackInput } from "@/lib/validators";
import type { PortfolioProfile, PortfolioProject, LocalizedString } from "@/types/portfolio";

import { AdminExperienceTab } from "./admin-experience-tab";
import { AdminOtherExperienceTab } from "./admin-other-experience-tab";
import { AdminActivitiesTab } from "./admin-activities-tab";
import { AdminResearchTab } from "./admin-research-tab";

type Notice =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

interface AdminDashboardProps {
  adminEmail: string;
}

interface ProjectFormState {
  title: LocalizedString;
  summary: LocalizedString;
  stackText: string;
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  isHidden: boolean;
}

const emptyLocalizedString: LocalizedString = { vi: "", en: "" };

const emptyProfileState: Omit<PortfolioProfile, "id"> = {
  fullName: "",
  headline: { ...emptyLocalizedString },
  role: { ...emptyLocalizedString },
  location: { ...emptyLocalizedString },
  bio: { ...emptyLocalizedString },
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  avatarUrl: "",
  cvUrl: "",
  stats: {
    years: "",
    projects: "",
    countries: "",
    reviews: "",
  },
};

const emptyProjectState: ProjectFormState = {
  title: { ...emptyLocalizedString },
  summary: { ...emptyLocalizedString },
  stackText: "",
  imageUrl: "",
  demoUrl: "",
  repoUrl: "",
  featured: false,
  order: 1,
  isHidden: false,
};

export function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    "profile" | "experience" | "otherExperience" | "projects" | "activities" | "research"
  >("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const [profile, setProfile] = useState<Omit<PortfolioProfile, "id">>(
    emptyProfileState,
  );
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(
    emptyProjectState,
  );

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects],
  );

  useEffect(() => {
    void loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    try {
      const [profileRes, projectsRes] = await Promise.all([
        fetch("/api/profile", { cache: "no-store" }),
        fetch("/api/projects", { cache: "no-store" }),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
        setProjectForm(prev => ({ ...prev, order: projectsData.length + 1 }));
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProfileData(data: Omit<PortfolioProfile, "id">, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      if (!silent) {
        setNotice({ type: "success", message: t("admin.notice.profileSaved") });
      }
    } catch {
      if (!silent) {
        setNotice({ type: "error", message: t("admin.notice.profileSaveError") });
      }
    } finally {
      if (!silent) setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!isAutoSaveEnabled || isLoading) return;
    const timer = setTimeout(() => {
      void saveProfileData(profile, true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [profile, isAutoSaveEnabled, isLoading]);

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveProfileData(profile);
  }

  async function saveProjectData(projectId: string | null, data: any, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    const endpoint = projectId ? `/api/projects/${projectId}` : "/api/projects";
    const method = projectId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();

      if (!silent) {
        setNotice({ type: "success", message: projectId ? t("admin.notice.projectUpdated") : t("admin.notice.projectCreated") });
        if (!projectId) {
          setProjectForm({ ...emptyProjectState, order: projects.length + 1 });
        } else {
          setEditingProjectId(null);
          setProjectForm({ ...emptyProjectState, order: projects.length + 1 });
        }
        await loadDashboardData();
      }
    } catch {
      if (!silent) {
        setNotice({ type: "error", message: t("admin.notice.projectSaveError") });
      }
    } finally {
      if (!silent) setIsSaving(false);
    }
  }

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stack = parseStackInput(projectForm.stackText);
    if (stack.length === 0) {
      setNotice({ type: "error", message: t("admin.notice.requireStack") });
      return;
    }
    const payload = { ...projectForm, stack, order: Number(projectForm.order) };
    await saveProjectData(editingProjectId, payload);
  }

  async function handleDeleteProject(projectId: string) {
    if (!window.confirm(t("admin.notice.projectDeleteConfirm"))) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setNotice({ type: "success", message: t("admin.notice.projectDeleted") });
      await loadDashboardData();
    } catch {
      setNotice({ type: "error", message: t("admin.notice.projectDeleteError") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleProfileFileUpload(file: File, field: "avatarUrl" | "cvUrl") {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setProfile(prev => ({ ...prev, [field]: url }));
      setNotice({ type: "success", message: t("admin.notice.uploaded") });
    } catch {
      setNotice({ type: "error", message: t("admin.notice.uploadError") });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleProjectImageUpload(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setProjectForm(prev => ({ ...prev, imageUrl: url }));
      setNotice({ type: "success", message: t("admin.notice.uploaded") });
    } catch {
      setNotice({ type: "error", message: t("admin.notice.uploadError") });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/80 bg-gradient-to-br from-[#fff7ec] to-[#f2e4d3] p-6 shadow-xl dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{t("admin.header.subtitle")}</p>
              <h1 className="font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">{t("admin.header.greeting")}, {adminEmail}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> {t("admin.header.logout")}</Button>
            </div>
          </div>
        </header>

        {notice && (
          <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {notice.message}
          </div>
        )}

        <nav className="flex flex-wrap gap-2 p-2 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-white/80 dark:border-zinc-800">
          {[
            { id: "profile", label: "👨‍💼 Profile", icon: User },
            { id: "experience", label: "💼 Kinh nghiệm Chuyên môn", icon: Briefcase },
            { id: "otherExperience", label: "🌟 Kinh nghiệm Khác", icon: Star },
            { id: "projects", label: "🚀 Dự án", icon: Layout },
            { id: "activities", label: "📢 Hoạt động", icon: MessageSquare },
            { id: "research", label: "📚 Nghiên cứu", icon: BookOpen },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`rounded-2xl px-6 py-6 h-auto ${activeTab === tab.id ? "shadow-lg scale-105" : "hover:bg-white dark:hover:bg-zinc-800"}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              <span className="font-bold">{tab.label}</span>
            </Button>
          ))}
        </nav>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">{t("admin.loading")}</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-6 rounded-3xl border border-white/80 bg-white/40 p-8 shadow-lg dark:bg-zinc-900/40">
                <h2 className="text-2xl font-black">{t("admin.profile.title")}</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label={t("admin.profile.field.fullName")}><Input value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} /></Field>
                  <Field label={t("admin.profile.field.email")}><Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></Field>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label={t("admin.profile.field.headline")}><Input value={profile.headline.vi} onChange={e => setProfile({...profile, headline: {...profile.headline, vi: e.target.value}})} /></Field>
                  <Field label={t("admin.profile.field.role")}><Input value={profile.role.vi} onChange={e => setProfile({...profile, role: {...profile.role, vi: e.target.value}})} /></Field>
                </div>
                <Field label={t("admin.profile.field.bio")}><Textarea rows={4} value={profile.bio.vi} onChange={e => setProfile({...profile, bio: {...profile.bio, vi: e.target.value}})} /></Field>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Avatar URL">
                    <div className="flex gap-2">
                      <Input value={profile.avatarUrl} onChange={e => setProfile({...profile, avatarUrl: e.target.value})} />
                      <label className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-xl flex items-center shrink-0 hover:bg-sky-600 transition-colors">
                        <UploadCloud className="h-4 w-4 mr-2" /> Upload
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleProfileFileUpload(e.target.files[0], "avatarUrl")} />
                      </label>
                    </div>
                  </Field>
                  <Field label="CV URL">
                    <div className="flex gap-2">
                      <Input value={profile.cvUrl} onChange={e => setProfile({...profile, cvUrl: e.target.value})} />
                      <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center shrink-0 hover:bg-orange-600 transition-colors">
                        <UploadCloud className="h-4 w-4 mr-2" /> Upload
                        <input type="file" className="hidden" accept="*/*" onChange={e => e.target.files?.[0] && handleProfileFileUpload(e.target.files[0], "cvUrl")} />
                      </label>
                    </div>
                  </Field>
                </div>
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto h-12 px-8 rounded-2xl"><Save className="h-4 w-4 mr-2" /> {t("admin.profile.save")}</Button>
              </form>
            )}

            {activeTab === "experience" && <AdminExperienceTab isAutoSaveEnabled={isAutoSaveEnabled} />}
            {activeTab === "otherExperience" && <AdminOtherExperienceTab isAutoSaveEnabled={isAutoSaveEnabled} />}
            {activeTab === "activities" && <AdminActivitiesTab isAutoSaveEnabled={isAutoSaveEnabled} />}
            {activeTab === "research" && <AdminResearchTab isAutoSaveEnabled={isAutoSaveEnabled} />}
            
            {activeTab === "projects" && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <form onSubmit={handleProjectSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-white/40 p-8 shadow-lg dark:bg-zinc-900/40">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">{editingProjectId ? "Sửa dự án" : "Thêm dự án mới"}</h2>
                    {editingProjectId && (
                      <Button type="button" variant="ghost" onClick={() => { setEditingProjectId(null); setProjectForm(emptyProjectState); }}>Hủy bỏ</Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Tên dự án (VI)"><Input required value={projectForm.title.vi} onChange={e => setProjectForm({...projectForm, title: {...projectForm.title, vi: e.target.value}})} /></Field>
                    <Field label="Tên dự án (EN)"><Input required value={projectForm.title.en} onChange={e => setProjectForm({...projectForm, title: {...projectForm.title, en: e.target.value}})} /></Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Mô tả tóm tắt (VI)"><Textarea required rows={3} value={projectForm.summary.vi} onChange={e => setProjectForm({...projectForm, summary: {...projectForm.summary, vi: e.target.value}})} /></Field>
                    <Field label="Mô tả tóm tắt (EN)"><Textarea required rows={3} value={projectForm.summary.en} onChange={e => setProjectForm({...projectForm, summary: {...projectForm.summary, en: e.target.value}})} /></Field>
                  </div>

                  <Field label="Công nghệ (Cách nhau bằng dấu phẩy, VD: React, Tailwind, Node.js)">
                    <Input required value={projectForm.stackText} onChange={e => setProjectForm({...projectForm, stackText: e.target.value})} placeholder="React, Node.js, ..." />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Demo URL"><Input value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} placeholder="https://..." /></Field>
                    <Field label="Repo URL"><Input value={projectForm.repoUrl} onChange={e => setProjectForm({...projectForm, repoUrl: e.target.value})} placeholder="https://github.com/..." /></Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Hình ảnh dự án (URL hoặc Upload)">
                      <div className="flex gap-2">
                        <Input value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} placeholder="https://..." />
                        <label className="cursor-pointer bg-sky-500 text-white px-3 py-2 rounded-xl flex items-center shrink-0 hover:bg-sky-600 transition-colors">
                          <UploadCloud className="h-4 w-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleProjectImageUpload(e.target.files[0])} />
                        </label>
                      </div>
                    </Field>
                    <Field label="Thứ tự hiển thị"><Input type="number" required value={projectForm.order} onChange={e => setProjectForm({...projectForm, order: Number(e.target.value)})} /></Field>
                  </div>

                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} className="h-4 w-4 rounded border-zinc-300" />
                      <span className="text-sm font-bold">Dự án nổi bật</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={projectForm.isHidden} onChange={e => setProjectForm({...projectForm, isHidden: e.target.checked})} className="h-4 w-4 rounded border-zinc-300" />
                      <span className="text-sm font-bold text-red-500">Ẩn dự án này</span>
                    </label>
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                    {editingProjectId ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                    {editingProjectId ? "Lưu cập nhật dự án" : "Tạo mới dự án"}
                  </Button>
                </form>

                <div className="space-y-4 rounded-3xl border border-white/80 bg-white/40 p-8 shadow-lg dark:bg-zinc-900/40">
                  <h2 className="text-2xl font-black">Danh sách dự án</h2>
                  <div className="space-y-3">
                    {sortedProjects.map(p => (
                      <div key={p.id} className={`flex justify-between items-center p-4 bg-white/80 dark:bg-zinc-800 rounded-2xl border ${p.isHidden ? "border-red-200 opacity-60" : "border-zinc-100 dark:border-zinc-700"}`}>
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} className="h-10 w-10 rounded-lg object-cover" alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center"><ImageIcon className="h-5 w-5 text-zinc-400" /></div>
                          )}
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.title[language]}</p>
                            <div className="flex gap-2">
                              {p.featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold uppercase">Featured</span>}
                              <span className="text-[10px] text-zinc-400 font-medium">#{p.order}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="text-sky-500" onClick={() => { setEditingProjectId(p.id); setProjectForm({ ...p, stackText: p.stack.join(", ") }); }}><Pencil className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteProject(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-center text-zinc-400 italic py-8">Chưa có dự án nào.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
      <span>{label}</span>
      {children}
    </label>
  );
}
