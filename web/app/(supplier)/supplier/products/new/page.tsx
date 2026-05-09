'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', categoryId: '', stock: '', images: '[]' });

  useEffect(() => { apiClient('/api/categories').then((res: any) => setCategories(res.data)).catch(() => {}); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/api/products', { method: 'POST', body: JSON.stringify({ ...form, price: parseFloat(form.price), comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null, stock: parseInt(form.stock) || 0 }) });
      router.push('/supplier/products');
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">发布商品</h1>
      <form onSubmit={submit} className="space-y-4">
        <input placeholder="商品名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" required />
        <textarea placeholder="商品描述" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2" rows={4} />
        <div className="flex gap-4">
          <input type="number" step="0.01" placeholder="价格" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border rounded px-3 py-2 flex-1" required />
          <input type="number" step="0.01" placeholder="原价 (可选)" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} className="border rounded px-3 py-2 flex-1" />
        </div>
        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full border rounded px-3 py-2" required>
          <option value="">选择分类</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="初始库存" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border rounded px-3 py-2" />
        <Button type="submit" className="w-full">发布</Button>
      </form>
    </div>
  );
}
