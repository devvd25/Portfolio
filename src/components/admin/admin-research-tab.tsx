"use client";

import { useLanguage } from "@/components/language-provider";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioResearch } from "@/types/portfolio";

export function AdminResearchTab() {
  const { t } = useLanguage();
  const [data, setData] = useState<PortfolioResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const emptyForm = {
    title: "",
    period: "",
    authorsText: "",
    abstract: "",
    technologiesText: "",
    achievementsText: "",
    demoUrl: "",
    documentUrl: "",
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
      const res = await fetch("/api/research", { cache: "no-store" });
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
      title: form.title,
      period: form.period,
      abstract: form.abstract,
      authors: form.authorsText.split(",").map(t => t.trim()).filter(Boolean),
      technologies: form.technologiesText.split(",").map(t => t.trim()).filter(Boolean),
      achievements: form.achievementsText.split("\n").map(t => t.trim()).filter(Boolean),
      demoUrl: form.demoUrl,
      documentUrl: form.documentUrl,
      order: Number(form.order),
    };

    try {
      const endpoint = editingId ? `/api/research/${editingId}` : "/api/research";
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
      const res = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotice({ type: "success", message: t("admin.common.deleteSuccess") });
      await loadData();
    } catch {
      setNotice({ type: "error", message: t("admin.common.deleteFailed") });
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: PortfolioResearch) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      period: item.period,
      abstract: item.abstract,
      authorsText: item.authors.join(", "),
      technologiesText: item.technologies.join(", "),
      achievementsText: item.achievements.join("\n"),
      demoUrl: item.demoUrl,
      documentUrl: item.documentUrl,
      order: item.order,
    });
  }

  if (isLoading) return <div className="p-6 text-sm">{t("admin.common.loading")}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {editingId ? t("admin.research.editTitle") : t("admin.research.add")}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("admin.common.cancel")}</Button>
          )}
        </div>

        {notice && <div className="p-3 text-sm rounded bg-amber-100 text-amber-800">{notice.message}</div>}

        <label className="text-sm font-semibold block">{t("admin.activities.title")} <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">{t("admin.experience.period")} <Input required value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} /></label>
          <label className="text-sm font-semibold">{t("admin.experience.order")} <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></label>
        </div>

        <label className="text-sm font-semibold block">{t("admin.research.authors")} <Input required value={form.authorsText} onChange={e => setForm({ ...form, authorsText: e.target.value })} /></label>
        <label className="text-sm font-semibold block">{t("admin.research.technologies")} <Input required value={form.technologiesText} onChange={e => setForm({ ...form, technologiesText: e.target.value })} /></label>

        <label className="text-sm font-semibold block">{t("admin.research.abstract")} <Textarea required rows={3} value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })} /></label>
        <label className="text-sm font-semibold block">{t("admin.research.achievements")} <Textarea required rows={3} value={form.achievementsText} onChange={e => setForm({ ...form, achievementsText: e.target.value })} /></label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.research.demoUrl")} <Input value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} /></label>
          <label className="text-sm font-semibold block">{t("admin.research.documentUrl")} <Input value={form.documentUrl} onChange={e => setForm({ ...form, documentUrl: e.target.value })} /></label>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full">
          {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editingId ? t("admin.common.update") : t("admin.common.create")}
        </Button>
      </form>

      <div className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">{t("admin.research.list")}</h2>
        <div className="space-y-3">
          {sortedData.map(item => (
            <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/70 flex justify-between">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
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
