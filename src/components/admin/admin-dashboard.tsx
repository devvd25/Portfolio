"use client";

import { LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
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
}

const emptyLocalizedString: LocalizedString = { vi: "", en: "" };

const emptyProfileState: Omit<PortfolioProfile, "id"> = {
  fullName: "",
  headline: { ...emptyLocalizedString },
  location: { ...emptyLocalizedString },
  bio: { ...emptyLocalizedString },
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  avatarUrl: "",
  cvUrl: "",
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
};

export function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    "projects" | "profile" | "experience" | "activities" | "research"
  >("projects");
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
    setNotice(null);

    try {
      const [profileResponse, projectsResponse] = await Promise.all([
        fetch("/api/profile", { cache: "no-store" }),
        fetch("/api/projects", { cache: "no-store" }),
      ]);

      if (!profileResponse.ok || !projectsResponse.ok) {
        throw new Error("load_failed");
      }

      const profileData = (await profileResponse.json()) as PortfolioProfile;
      const projectsData = (await projectsResponse.json()) as PortfolioProject[];

      setProfile({
        fullName: profileData.fullName,
        headline: profileData.headline,
        location: profileData.location,
        bio: profileData.bio,
        email: profileData.email,
        githubUrl: profileData.githubUrl,
        linkedinUrl: profileData.linkedinUrl,
        avatarUrl: profileData.avatarUrl,
        cvUrl: profileData.cvUrl,
      });
      setProjects(projectsData);
      setProjectForm((prev) => ({
        ...prev,
        order: Math.max(1, projectsData.length + 1),
      }));
    } catch {
      setNotice({
        type: "error",
        message: t("admin.notice.loadDashboardFailed"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Refactored profile save logic to be callable by auto-save
  async function saveProfileData(data: Omit<PortfolioProfile, "id">, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string; error?: string };
        throw new Error(payload.message ?? t("admin.notice.profileSaveFailed"));
      }

      if (!silent) {
        setNotice({
          type: "success",
          message: t("admin.notice.profileSaved"),
        });
      }
    } catch (error) {
      if (!silent) {
        setNotice({
          type: "error",
          message: error instanceof Error ? error.message : t("admin.notice.profileSaveError"),
        });
      }
    } finally {
      if (!silent) setIsSaving(false);
    }
  }

  // Auto-save effect for Profile
  useEffect(() => {
    if (!isAutoSaveEnabled || isLoading) return;

    const timer = setTimeout(() => {
      void saveProfileData(profile, true);
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [profile, isAutoSaveEnabled, isLoading]);

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveProfileData(profile);
  }

  async function saveProjectData(projectId: string | null, data: any, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    const endpoint = projectId
      ? `/api/projects/${projectId}`
      : "/api/projects";
    const method = projectId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string; error?: string };
        throw new Error(result.message ?? t("admin.notice.projectSaveFailed"));
      }

      if (!silent) {
        setNotice({
          type: "success",
          message: projectId
            ? t("admin.notice.projectUpdated")
            : t("admin.notice.projectCreated"),
        });

        if (!projectId) {
          setProjectForm({
            ...emptyProjectState,
            order: Math.max(1, projects.length + 1),
          });
        }
        await loadDashboardData();
      }
    } catch (error) {
      if (!silent) {
        setNotice({
          type: "error",
          message: error instanceof Error ? error.message : t("admin.notice.projectSaveError"),
        });
      }
    } finally {
      if (!silent) setIsSaving(false);
    }
  }

  // Auto-save effect for Projects (only when editing)
  useEffect(() => {
    if (!isAutoSaveEnabled || isLoading || !editingProjectId) return;

    const stack = parseStackInput(projectForm.stackText);
    if (stack.length === 0) return;

    const timer = setTimeout(() => {
      const payload = {
        title: projectForm.title,
        summary: projectForm.summary,
        stack,
        imageUrl: projectForm.imageUrl,
        demoUrl: projectForm.demoUrl,
        repoUrl: projectForm.repoUrl,
        featured: projectForm.featured,
        order: Number(projectForm.order),
      };
      void saveProjectData(editingProjectId, payload, true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [projectForm, isAutoSaveEnabled, isLoading, editingProjectId]);

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stack = parseStackInput(projectForm.stackText);
    if (stack.length === 0) {
      setNotice({ type: "error", message: t("admin.notice.requireStack") });
      return;
    }

    const payload = {
      title: projectForm.title,
      summary: projectForm.summary,
      stack,
      imageUrl: projectForm.imageUrl,
      demoUrl: projectForm.demoUrl,
      repoUrl: projectForm.repoUrl,
      featured: projectForm.featured,
      order: Number(projectForm.order),
    };

    await saveProjectData(editingProjectId, payload);
    if (!editingProjectId) {
      setEditingProjectId(null);
    }
  }

  async function handleDeleteProject(projectId: string) {
    const shouldDelete = window.confirm(t("admin.notice.projectDeleteConfirm"));

    if (!shouldDelete) {
      return;
    }

    setIsSaving(true);
    setNotice(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message ?? t("admin.notice.projectDeleteFailed"));
      }

      setNotice({
        type: "success",
        message: t("admin.notice.projectDeleted"),
      });

      if (editingProjectId === projectId) {
        setEditingProjectId(null);
        setProjectForm({
          ...emptyProjectState,
          order: Math.max(1, projects.length),
        });
      }

      await loadDashboardData();
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : t("admin.notice.projectDeleteError"),
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditProject(project: PortfolioProject) {
    setActiveTab("projects");
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      summary: project.summary,
      stackText: project.stack.join(", "),
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      featured: project.featured,
      order: project.order,
    });
  }

  async function handleImageUpload(file: File) {
    setIsUploading(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? t("admin.notice.uploadFailed"));
      }

      const result = (await response.json()) as { url: string };

      setProjectForm((prev) => ({
        ...prev,
        imageUrl: result.url,
      }));

      setNotice({
        type: "success",
        message: t("admin.notice.uploaded"),
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error ? error.message : t("admin.notice.uploadError"),
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleProfileFileUpload(file: File, field: "avatarUrl" | "cvUrl") {
    setIsUploading(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? t("admin.notice.uploadFailed"));
      }

      const result = (await response.json()) as { url: string };

      setProfile((prev) => ({
        ...prev,
        [field]: result.url,
      }));

      setNotice({
        type: "success",
        message: t("admin.notice.uploaded"),
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error ? error.message : t("admin.notice.uploadError"),
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/80 bg-gradient-to-br from-[#fff7ec] to-[#f2e4d3] p-6 shadow-[0_24px_44px_-20px_rgba(146,89,40,0.45)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                {t("admin.header.subtitle")}
              </p>
              <h1 className="font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
                {t("admin.header.greeting")}, {adminEmail}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="mr-4 flex items-center gap-2 rounded-2xl border border-white/40 bg-white/30 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800/50">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Auto Save
                </span>
                <button
                  onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isAutoSaveEnabled ? "bg-orange-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAutoSaveEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="outline" onClick={() => void loadDashboardData()}>
                {t("admin.header.reload")}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t("admin.header.logout")}
              </Button>
            </div>
          </div>
        </header>

        {notice ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "profile" ? "default" : "outline"}
            onClick={() => setActiveTab("profile")}
          >
            {t("admin.tab.profile")}
          </Button>
          <Button
            variant={activeTab === "experience" ? "default" : "outline"}
            onClick={() => setActiveTab("experience")}
          >
            {t("admin.tab.experience")}
          </Button>
          <Button
            variant={activeTab === "projects" ? "default" : "outline"}
            onClick={() => setActiveTab("projects")}
          >
            {t("admin.tab.projects")}
          </Button>
          <Button
            variant={activeTab === "activities" ? "default" : "outline"}
            onClick={() => setActiveTab("activities")}
          >
            {t("admin.tab.activities")}
          </Button>
          <Button
            variant={activeTab === "research" ? "default" : "outline"}
            onClick={() => setActiveTab("research")}
          >
            {t("admin.tab.research")}
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
            {t("admin.loading")}
          </div>
        ) : null}

        {!isLoading && activeTab === "projects" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleProjectSubmit}
              className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-[0_20px_34px_-20px_rgba(121,74,40,0.4)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {editingProjectId
                    ? t("admin.projects.editTitle")
                    : t("admin.projects.createTitle")}
                </h2>
                {editingProjectId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        ...emptyProjectState,
                        order: Math.max(1, projects.length + 1),
                      });
                    }}
                  >
                    {t("admin.projects.cancelEdit")}
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t("admin.projects.field.title")} (VI)`}>
                  <Input
                    required
                    value={projectForm.title.vi}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, title: { ...prev.title, vi: event.target.value } }))
                    }
                    placeholder="Tên dự án bằng tiếng Việt"
                  />
                </Field>

                <Field label={`${t("admin.projects.field.title")} (EN)`}>
                  <Input
                    required
                    value={projectForm.title.en}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, title: { ...prev.title, en: event.target.value } }))
                    }
                    placeholder="Project title in English"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t("admin.projects.field.summary")} (VI)`}>
                  <Textarea
                    required
                    value={projectForm.summary.vi}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, summary: { ...prev.summary, vi: event.target.value } }))
                    }
                    placeholder="Mô tả dự án bằng tiếng Việt"
                  />
                </Field>

                <Field label={`${t("admin.projects.field.summary")} (EN)`}>
                  <Textarea
                    required
                    value={projectForm.summary.en}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, summary: { ...prev.summary, en: event.target.value } }))
                    }
                    placeholder="Project summary in English"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("admin.projects.field.stack")}>
                  <Input
                    required
                    value={projectForm.stackText}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, stackText: event.target.value }))
                    }
                    placeholder={t("admin.projects.placeholder.stack")}
                  />
                </Field>

                <Field label={t("admin.projects.field.order")}>
                  <Input
                    required
                    type="number"
                    min={1}
                    value={projectForm.order}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        order: Number(event.target.value) || 1,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label={t("admin.projects.field.imageUrl")}>
                <Input
                  value={projectForm.imageUrl}
                  onChange={(event) =>
                    setProjectForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                  }
                  placeholder={t("admin.projects.placeholder.image")}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                  <UploadCloud className="h-4 w-4 text-sky-500" />
                  {isUploading
                    ? t("admin.projects.uploading")
                    : t("admin.projects.upload")}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0];

                      if (selectedFile) {
                        void handleImageUpload(selectedFile);
                      }
                    }}
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-400"
                    checked={projectForm.featured}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        featured: event.target.checked,
                      }))
                    }
                  />
                  {t("admin.projects.featured")}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("admin.projects.field.demoUrl")}>
                  <Input
                    value={projectForm.demoUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, demoUrl: event.target.value }))
                    }
                    placeholder={t("admin.projects.placeholder.demo")}
                  />
                </Field>

                <Field label={t("admin.projects.field.repoUrl")}>
                  <Input
                    value={projectForm.repoUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, repoUrl: event.target.value }))
                    }
                    placeholder={t("admin.projects.placeholder.repo")}
                  />
                </Field>
              </div>

              <Button type="submit" disabled={isSaving || isUploading} className="w-full">
                {editingProjectId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingProjectId
                  ? t("admin.projects.saveUpdate")
                  : t("admin.projects.add")}
              </Button>
            </form>

            <div className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-[0_20px_34px_-20px_rgba(121,74,40,0.4)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
              <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {t("admin.projects.listTitle")}
              </h2>

              <div className="space-y-3">
                {sortedProjects.length === 0 ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {t("admin.projects.empty")}
                  </p>
                ) : null}

                {sortedProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {project.order}. {project.title[language]}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                          {project.summary[language]}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {project.stack.join(" | ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(project)}
                        >
                          {t("admin.projects.edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === "profile" ? (
          <form
            onSubmit={handleProfileSave}
            className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-[0_20px_34px_-20px_rgba(121,74,40,0.4)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
          >
            <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {t("admin.profile.title")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("admin.profile.field.fullName")}>
                <Input
                  required
                  value={profile.fullName}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </Field>

              <Field label={t("admin.profile.field.email")}>
                <Input
                  required
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`${t("admin.profile.field.headline")} (VI)`}>
                <Input
                  required
                  value={profile.headline.vi}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, headline: { ...prev.headline, vi: event.target.value } }))
                  }
                />
              </Field>

              <Field label={`${t("admin.profile.field.headline")} (EN)`}>
                <Input
                  required
                  value={profile.headline.en}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, headline: { ...prev.headline, en: event.target.value } }))
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`${t("admin.profile.field.location")} (VI)`}>
                <Input
                  required
                  value={profile.location.vi}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, location: { ...prev.location, vi: event.target.value } }))
                  }
                />
              </Field>

              <Field label={`${t("admin.profile.field.location")} (EN)`}>
                <Input
                  required
                  value={profile.location.en}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, location: { ...prev.location, en: event.target.value } }))
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`${t("admin.profile.field.bio")} (VI)`}>
                <Textarea
                  required
                  value={profile.bio.vi}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, bio: { ...prev.bio, vi: event.target.value } }))
                  }
                />
              </Field>

              <Field label={`${t("admin.profile.field.bio")} (EN)`}>
                <Textarea
                  required
                  value={profile.bio.en}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, bio: { ...prev.bio, en: event.target.value } }))
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("admin.profile.field.github")}>
                <Input
                  value={profile.githubUrl}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, githubUrl: event.target.value }))
                  }
                />
              </Field>

              <Field label={t("admin.profile.field.linkedin")}>
                <Input
                  value={profile.linkedinUrl}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, linkedinUrl: event.target.value }))
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Field label={t("admin.profile.field.avatar")}>
                  <Input
                    value={profile.avatarUrl}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, avatarUrl: event.target.value }))
                    }
                  />
                </Field>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                  <UploadCloud className="h-3.5 w-3.5 text-sky-500" />
                  {isUploading ? "Uploading..." : "Upload Avatar"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleProfileFileUpload(file, "avatarUrl");
                    }}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Field label={t("admin.profile.field.cv")}>
                  <Input
                    value={profile.cvUrl}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, cvUrl: event.target.value }))
                    }
                  />
                </Field>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                  <UploadCloud className="h-3.5 w-3.5 text-sky-500" />
                  {isUploading ? "Uploading..." : "Upload CV (PDF/Image)"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleProfileFileUpload(file, "cvUrl");
                    }}
                  />
                </label>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {t("admin.profile.save")}
            </Button>
          </form>
        ) : null}

        {!isLoading && activeTab === "experience" && <AdminExperienceTab isAutoSaveEnabled={isAutoSaveEnabled} />}
        {!isLoading && activeTab === "activities" && <AdminActivitiesTab isAutoSaveEnabled={isAutoSaveEnabled} />}
        {!isLoading && activeTab === "research" && <AdminResearchTab isAutoSaveEnabled={isAutoSaveEnabled} />}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="space-y-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
      <span>{label}</span>
      {children}
    </label>
  );
}
