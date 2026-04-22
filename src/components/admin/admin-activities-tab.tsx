"use client";

import { useLanguage } from "@/components/language-provider";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioActivity, LocalizedString } from "@/types/portfolio";

export function AdminActivitiesTab() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PortfolioActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const emptyLocalizedString: LocalizedString = { vi: "", en: "" };
  const emptyForm = {
    title: { ...emptyLocalizedString },
    description: { ...emptyLocalizedString },
    imageUrl: "",
    category: "community" as "community" | "workshop",
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
      const res = await fetch("/api/activities", { cache: "no-store" });
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

    const payload = { ...form, order: Number(form.order) };

    try {
      const endpoint = editingId ? `/api/activities/${editingId}` : "/api/activities";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      setNotice({ type: "success", message: t("admin.common.saveSuccess") });
      setEditingId(null);
      setForm({ ...emptyForm, order: data.length + 1 });
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
      const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotice({ type: "success", message: t("admin.common.deleteSuccess") });
      await loadData();
    } catch {
      setNotice({ type: "error", message: t("admin.common.deleteFailed") });
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: PortfolioActivity) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      order: item.order,
    });
  }

  if (isLoading) return <div className="p-6 text-sm">{t("admin.common.loading")}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {editingId ? t("admin.activities.editTitle") : t("admin.activities.add")}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("admin.common.cancel")}</Button>
          )}
        </div>

        {notice && <div className={`p-3 text-sm rounded ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{notice.message}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.activities.title")} (VI)
            <Input required value={form.title.vi} onChange={e => setForm({ ...form, title: { ...form.title, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">{t("admin.activities.title")} (EN)
            <Input required value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} />
          </label>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">{t("admin.activities.description")} (VI)
            <Textarea required rows={3} value={form.description.vi} onChange={e => setForm({ ...form, description: { ...form.description, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">{t("admin.activities.description")} (EN)
            <Textarea required rows={3} value={form.description.en} onChange={e => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">{t("admin.activities.category")} 
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value as "community" | "workshop" })}
            >
              <option value="community">{t("admin.activities.category.community")}</option>
              <option value="workshop">{t("admin.activities.category.workshop")}</option>
            </select>
          </label>
          <label className="text-sm font-semibold">{t("admin.experience.order")} <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" /></label>
        </div>

        <label className="text-sm font-semibold block">{t("admin.activities.imageUrl")} <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></label>

        <Button type="submit" disabled={isSaving} className="w-full">
          {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editingId ? t("admin.common.update") : t("admin.common.create")}
        </Button>
      </form>

      <div className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">{t("admin.activities.list")}</h2>
        <div className="space-y-3">
          {sortedData.map(item => (
            <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/70 flex justify-between">
              <div>
                <h3 className="font-semibold">{item.title[language]}</h3>
                <p className="text-xs text-muted-foreground uppercase">{item.category}</p>
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
