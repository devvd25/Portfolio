"use client";

import { Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioExperience } from "@/types/portfolio";

export function AdminExperienceTab() {
  const { t } = useLanguage();
  const [data, setData] = useState<PortfolioExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const emptyForm = {
    company: "",
    role: "",
    period: "",
    tasksText: "",
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
    setIsSaving(true);
    setNotice(null);

    const payload = {
      company: form.company,
      role: form.role,
      period: form.period,
      tasks: form.tasksText.split("\n").map(t => t.trim()).filter(Boolean),
      techStack: form.techStackText.split(",").map(t => t.trim()).filter(Boolean),
      order: Number(form.order),
    };

    try {
      const endpoint = editingId ? `/api/experience/${editingId}` : "/api/experience";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      setNotice({ type: "success", message: t("admin.common.saveSuccess") });
      setEditingId(null);
      setForm(emptyForm);
      await loadData();
    } catch {
      setNotice({ type: "error", message: t("admin.common.saveFailed") });
    } finally {
      setIsSaving(false);
    }
  }

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
      tasksText: item.tasks.join("\n"),
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

        {notice && <div className="p-3 text-sm rounded bg-amber-100 text-amber-800">{notice.message}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">{t("admin.experience.company")} <Input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label>
          <label className="text-sm font-semibold">{t("admin.experience.role")} <Input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">{t("admin.experience.period")} <Input required value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} /></label>
          <label className="text-sm font-semibold">{t("admin.experience.order")} <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></label>
        </div>

        <label className="text-sm font-semibold block">{t("admin.experience.techStack")} <Input required value={form.techStackText} onChange={e => setForm({ ...form, techStackText: e.target.value })} /></label>
        
        <label className="text-sm font-semibold block">{t("admin.experience.tasks")} <Textarea required rows={4} value={form.tasksText} onChange={e => setForm({ ...form, tasksText: e.target.value })} /></label>

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
                <h3 className="font-semibold">{item.role} @ {item.company}</h3>
                <p className="text-xs text-muted-foreground">{item.period}</p>
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
