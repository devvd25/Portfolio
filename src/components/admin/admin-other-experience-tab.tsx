"use client";

import { Plus, Save, Trash2, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioOtherExperience, LocalizedString } from "@/types/portfolio";

export function AdminOtherExperienceTab({ isAutoSaveEnabled = false }: { isAutoSaveEnabled?: boolean }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PortfolioOtherExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const emptyForm = {
    title: { vi: "", en: "" },
    description: { vi: "", en: "" },
    period: { vi: "", en: "" },
    imageUrl: "",
    order: 1,
    isHidden: false,
  };
  const [form, setForm] = useState(emptyForm);

  const sortedData = useMemo(() => [...data].sort((a, b) => a.order - b.order), [data]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/other-experience", { cache: "no-store" });
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
    await saveData(editingId, form);
  }

  async function saveData(id: string | null, payload: any, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    try {
      const endpoint = id ? `/api/other-experience/${id}` : "/api/other-experience";
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
      void saveData(editingId, form, true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, isAutoSaveEnabled, isLoading, editingId]);

  async function handleDelete(id: string) {
    if (!window.confirm(t("admin.common.deleteConfirm"))) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/other-experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotice({ type: "success", message: t("admin.common.deleteSuccess") });
      await loadData();
    } catch {
      setNotice({ type: "error", message: t("admin.common.deleteFailed") });
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: PortfolioOtherExperience) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      period: item.period,
      imageUrl: item.imageUrl || "",
      order: item.order,
      isHidden: item.isHidden || false,
    });
  }

  if (isLoading) return <div className="p-6 text-sm">{t("admin.common.loading")}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {editingId ? "Sửa kinh nghiệm khác" : "Thêm kinh nghiệm khác"}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("admin.common.cancel")}</Button>
          )}
        </div>

        {notice && <div className={`p-3 text-sm rounded ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{notice.message}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Tiêu đề (VI)
            <Input required value={form.title.vi} onChange={e => setForm({ ...form, title: { ...form.title, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">Tiêu đề (EN)
            <Input required value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Thời gian (VI) - VD: 2025
            <Input required value={form.period.vi} onChange={e => setForm({ ...form, period: { ...form.period, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">Thời gian (EN) - VD: 2025
            <Input required value={form.period.en} onChange={e => setForm({ ...form, period: { ...form.period, en: e.target.value } })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Thứ tự
            <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </label>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
              <input 
                type="checkbox" 
                checked={form.isHidden} 
                onChange={e => setForm({ ...form, isHidden: e.target.checked })} 
                className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
              />
              Ẩn mục này
            </label>
          </div>
        </div>

        <label className="text-sm font-semibold block">Ảnh minh họa (URL - Không bắt buộc)
          <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Mô tả (VI)
            <Textarea required rows={3} value={form.description.vi} onChange={e => setForm({ ...form, description: { ...form.description, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">Mô tả (EN)
            <Textarea required rows={3} value={form.description.en} onChange={e => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
          </label>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full">
          {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editingId ? t("admin.common.update") : t("admin.common.create")}
        </Button>
      </form>

      <div className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">Danh sách kinh nghiệm khác</h2>
        <div className="space-y-3">
          {sortedData.length === 0 && <p className="text-sm text-muted-foreground italic">Chưa có dữ liệu.</p>}
          {sortedData.map(item => (
            <article 
              key={item.id} 
              className={`rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/70 flex justify-between items-center ${item.isHidden ? "opacity-50" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold truncate text-sm">{item.title[language]} ({item.period[language]})</h4>
                <p className="text-[10px] text-muted-foreground truncate">{item.description[language]}</p>
              </div>
              <div className="flex gap-1 ml-4 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
