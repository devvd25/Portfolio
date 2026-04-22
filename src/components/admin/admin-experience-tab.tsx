"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioExperience, LocalizedString } from "@/types/portfolio";

export function AdminExperienceTab({ isAutoSaveEnabled = false }: { isAutoSaveEnabled?: boolean }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PortfolioExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const emptyForm = {
    company: "",
    role: { vi: "", en: "" },
    period: { vi: "", en: "" },
    tasksTextVI: "",
    tasksTextEN: "",
    techStackText: "",
    order: 1,
  };
  const [form, setForm] = useState(emptyForm);

  const sortedData = useMemo(() => [...data].sort((a, b) => a.order - b.order), [data]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/experience", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      setForm((prev) => ({ ...prev, order: Math.max(1, json.length + 1) }));
    } catch {
      setNotice({ type: "error", message: t("admin.common.loadFailed") });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const viTasks = form.tasksTextVI.split("\n").map(t => t.trim()).filter(Boolean);
    const enTasks = form.tasksTextEN.split("\n").map(t => t.trim()).filter(Boolean);
    const maxTasks = Math.max(viTasks.length, enTasks.length);
    
    const tasks: LocalizedString[] = [];
    for (let i = 0; i < maxTasks; i++) {
      tasks.push({
        vi: viTasks[i] || "",
        en: enTasks[i] || ""
      });
    }

    const finalPayload = {
      company: form.company,
      role: form.role,
      period: form.period,
      tasks,
      techStack: form.techStackText.split(",").map(t => t.trim()).filter(Boolean),
      order: Number(form.order),
    };

    await saveData(editingId, finalPayload);
  }

  async function saveData(id: string | null, payload: any, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    try {
      const endpoint = id ? `/api/experience/${id}` : "/api/experience";
      const method = id ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      if (!silent) {
        setNotice({ type: "success", message: t("admin.common.saveSuccess") });
        setEditingId(null);
        setForm({ ...emptyForm, order: data.length + 1 });
        await loadData();
      }
    } catch {
      if (!silent) {
        setNotice({ type: "error", message: t("admin.common.saveFailed") });
      }
    } finally {
      if (!silent) setIsSaving(false);
    }
  }

  // Auto-save effect
  useEffect(() => {
    if (!isAutoSaveEnabled || isLoading || !editingId) return;

    const timer = setTimeout(() => {
      const viTasks = form.tasksTextVI.split("\n").map(t => t.trim()).filter(Boolean);
      const enTasks = form.tasksTextEN.split("\n").map(t => t.trim()).filter(Boolean);
      const maxTasks = Math.max(viTasks.length, enTasks.length);
      const tasks: LocalizedString[] = [];
      for (let i = 0; i < maxTasks; i++) {
        tasks.push({ vi: viTasks[i] || "", en: enTasks[i] || "" });
      }

      const finalPayload = {
        company: form.company,
        role: form.role,
        period: form.period,
        tasks,
        techStack: form.techStackText.split(",").map(t => t.trim()).filter(Boolean),
        order: Number(form.order),
      };
      void saveData(editingId, finalPayload, true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, isAutoSaveEnabled, isLoading, editingId]);

  async function handleDelete(id: string) {
    if (!window.confirm(t("admin.common.deleteConfirm"))) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotice({ type: "success", message: t("admin.common.deleteSuccess") });
      await loadData();
    } catch {
      setNotice({ type: "error", message: t("admin.common.deleteFailed") });
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: PortfolioExperience) {
    setEditingId(item.id);
    setForm({
      company: item.company,
      role: item.role,
      period: item.period,
      tasksTextVI: item.tasks.map(t => t.vi).join("\n"),
      tasksTextEN: item.tasks.map(t => t.en).join("\n"),
      techStackText: item.techStack.join(", "),
      order: item.order,
    });
  }

  if (isLoading) return <div className="p-6 text-sm">{t("admin.common.loading")}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {editingId ? t("admin.experience.editTitle") : t("admin.experience.add")}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("admin.common.cancel")}</Button>
          )}
        </div>

        {notice && <div className={`p-3 text-sm rounded ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{notice.message}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.experience.company")} 
            <Input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </label>
          <label className="text-sm font-semibold block">{t("admin.experience.order")} 
            <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.experience.role")} (VI)
            <Input required value={form.role.vi} onChange={e => setForm({ ...form, role: { ...form.role, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">{t("admin.experience.role")} (EN)
            <Input required value={form.role.en} onChange={e => setForm({ ...form, role: { ...form.role, en: e.target.value } })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.experience.period")} (VI)
            <Input required value={form.period.vi} onChange={e => setForm({ ...form, period: { ...form.period, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">{t("admin.experience.period")} (EN)
            <Input required value={form.period.en} onChange={e => setForm({ ...form, period: { ...form.period, en: e.target.value } })} />
          </label>
        </div>

        <label className="text-sm font-semibold block">{t("admin.experience.techStack")} 
          <Input required value={form.techStackText} onChange={e => setForm({ ...form, techStackText: e.target.value })} placeholder="React, Next.js, Node.js..." />
        </label>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.experience.tasks")} (VI)
            <Textarea required rows={4} value={form.tasksTextVI} onChange={e => setForm({ ...form, tasksTextVI: e.target.value })} placeholder="Mỗi dòng một nhiệm vụ" />
          </label>
          <label className="text-sm font-semibold block">{t("admin.experience.tasks")} (EN)
            <Textarea required rows={4} value={form.tasksTextEN} onChange={e => setForm({ ...form, tasksTextEN: e.target.value })} placeholder="One task per line" />
          </label>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full">
          {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editingId ? t("admin.common.update") : t("admin.common.create")}
        </Button>
      </form>

      <div className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">{t("admin.experience.list")}</h2>
        <div className="space-y-3">
          {sortedData.map(item => (
            <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/70 flex justify-between">
              <div>
                <h3 className="font-semibold">{item.role[language]} @ {item.company}</h3>
                <p className="text-xs text-muted-foreground">{item.period[language]}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>{t("admin.common.edit")}</Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
