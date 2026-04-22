"use client";

import { useLanguage } from "@/components/language-provider";
import { Plus, Save, Trash2, UploadCloud, Pencil, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioActivity, LocalizedString } from "@/types/portfolio";

export function AdminActivitiesTab({ isAutoSaveEnabled = false }: { isAutoSaveEnabled?: boolean }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PortfolioActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyLocalizedString: LocalizedString = { vi: "", en: "" };
  const emptyForm = {
    title: { ...emptyLocalizedString },
    description: { ...emptyLocalizedString },
    imageUrl: "",
    category: "community" as "community" | "workshop" | "qualification",
    date: "",
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
    const payload = { ...form, order: Number(form.order) };
    await saveData(editingId, payload);
  }

  async function saveData(id: string | null, payload: any, silent = false) {
    if (!silent) setIsSaving(true);
    if (!silent) setNotice(null);

    try {
      const endpoint = id ? `/api/activities/${id}` : "/api/activities";
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
      const payload = { ...form, order: Number(form.order) };
      void saveData(editingId, payload, true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, isAutoSaveEnabled, isLoading, editingId]);

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

  async function handleFileUpload(file: File) {
    setIsUploading(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const payload = (await res.json()) as { message?: string };
        throw new Error(payload.message || t("admin.notice.uploadFailed"));
      }

      const result = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: result.url }));
      setNotice({ type: "success", message: t("admin.common.uploadSuccess") || "Upload thành công!" });
    } catch (error) {
      setNotice({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Lỗi upload" 
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleEdit(item: PortfolioActivity) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category,
      date: item.date || "",
      order: item.order,
    });
  }

  function getCategoryLabel(cat: string) {
    switch (cat) {
      case "community": return "Hoạt động cộng đồng/Community Service";
      case "workshop": return "Hội thảo, khóa học/Workshops and Courses";
      case "qualification": return "Giáo dục, bằng cấp/Education and Qualifications";
      default: return cat;
    }
  }

  if (isLoading) return <div className="p-6 text-sm">{t("admin.common.loading")}</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-gradient-to-br from-white to-[#f7ecdf] p-6 shadow-md dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {editingId ? "Cập nhật Hoạt động / Bằng cấp" : "Thêm Hoạt động / Bằng cấp mới"}
          </h2>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("admin.common.cancel")}</Button>
          )}
        </div>

        {notice && <div className={`p-3 text-sm rounded ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{notice.message}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Tiêu đề / Tên chứng chỉ (VI)
            <Input required value={form.title.vi} onChange={e => setForm({ ...form, title: { ...form.title, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">Tiêu đề / Tên chứng chỉ (EN)
            <Input required value={form.title.en} onChange={e => setForm({ ...form, title: { ...form.title, en: e.target.value } })} />
          </label>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold block">Mô tả chi tiết (VI)
            <Textarea required rows={3} value={form.description.vi} onChange={e => setForm({ ...form, description: { ...form.description, vi: e.target.value } })} />
          </label>
          <label className="text-sm font-semibold block">Mô tả chi tiết (EN)
            <Textarea required rows={3} value={form.description.en} onChange={e => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">Danh mục
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value as any })}
            >
              <option value="community">Hoạt động cộng đồng</option>
              <option value="workshop">Hội thảo & Workshop</option>
              <option value="qualification">Bằng cấp & Chứng chỉ</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Ngày tháng (Ví dụ: 16/04/2026)
            <Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1" placeholder="16/04/2026" />
          </label>
          <label className="text-sm font-semibold">Thứ tự hiển thị <Input type="number" required value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" /></label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold block">Hình ảnh (Chứng chỉ / Hoạt động)
            <div className="flex gap-2 mt-1">
              <Input 
                value={form.imageUrl} 
                onChange={e => setForm({ ...form, imageUrl: e.target.value })} 
                className="flex-1"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                <UploadCloud className="h-4 w-4 mr-2 text-sky-500" />
                {isUploading ? "..." : "Upload"}
              </Button>
            </div>
          </label>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20">
          {editingId ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
          {editingId ? "Cập nhật dữ liệu" : "Tạo mới mục này"}
        </Button>
      </form>

      <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
        <h2 className="font-display text-2xl font-black text-red-600 mb-6">Danh sách bằng cấp, chứng chỉ và hoạt động</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50 w-12">Stt</th>
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50 w-24">Hình ảnh</th>
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50 w-1/4">Danh mục</th>
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50">Mô tả</th>
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50 w-32">Ngày</th>
                <th className="py-4 px-2 text-sm font-black text-zinc-900 dark:text-zinc-50 text-right w-24">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 italic">Chưa có dữ liệu nào.</td>
                </tr>
              )}
              {sortedData.map((item, index) => (
                <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 px-2 text-sm text-zinc-600 dark:text-zinc-400">{item.order}</td>
                  <td className="py-4 px-2">
                    {item.imageUrl ? (
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <ImageIcon className="h-5 w-5 text-zinc-300" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{getCategoryLabel(item.category)}</p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{item.title.vi}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{item.description.vi}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">{item.date || "---"}</td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-sky-500" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <span className="text-zinc-200 dark:text-zinc-800 py-1 px-1">|</span>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-500" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
