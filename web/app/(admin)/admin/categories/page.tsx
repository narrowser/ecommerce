'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', parentId: '' });

  const load = () => apiClient('/api/categories').then((res: any) => setCategories(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await apiClient('/api/categories', { method: 'POST', body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: '', slug: '', parentId: '' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={() => setShowForm(true)}>新增分类</Button>
      </div>
      {showForm && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <input placeholder="名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="父分类ID (可选)" value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })} className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2">
            <Button onClick={submit}>保存</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="border rounded-lg p-3 flex items-center justify-between">
            <span className="font-medium">{c.name} <span className="text-gray-400 text-sm">({c.slug})</span></span>
            {c.children?.length > 0 && <span className="text-xs text-gray-500">{c.children.length} 个子分类</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
