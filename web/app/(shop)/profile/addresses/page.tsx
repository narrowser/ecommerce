'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ receiver: '', phone: '', address: '', city: '', state: '', zipCode: '' });

  const load = () => apiClient('/api/addresses').then((res: any) => setAddresses(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await apiClient('/api/addresses', { method: 'POST', body: JSON.stringify({ ...form, label: 'Home' }) });
    setShowForm(false);
    setForm({ receiver: '', phone: '', address: '', city: '', state: '', zipCode: '' });
    load();
  };

  const remove = async (id: string) => { await apiClient(`/api/addresses/${id}`, { method: 'DELETE' }); load(); };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">收货地址</h1>
        <Button onClick={() => setShowForm(true)}>新增地址</Button>
      </div>
      {showForm && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <input placeholder="收件人" value={form.receiver} onChange={e => setForm({ ...form, receiver: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="电话" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="详细地址" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2">
            <input placeholder="城市" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border rounded px-3 py-2 flex-1" />
            <input placeholder="省份" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="border rounded px-3 py-2 flex-1" />
            <input placeholder="邮编" value={form.zipCode} onChange={e => setForm({ ...form, zipCode: e.target.value })} className="border rounded px-3 py-2 w-24" />
          </div>
          <div className="flex gap-2">
            <Button onClick={submit}>保存</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
          </div>
        </div>
      )}
      {addresses.map(addr => (
        <div key={addr.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">{addr.receiver} — {addr.phone}</p>
            <p className="text-sm text-gray-500">{addr.address} {addr.city} {addr.state}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => remove(addr.id)}>删除</Button>
        </div>
      ))}
    </div>
  );
}
