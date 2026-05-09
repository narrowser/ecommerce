'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'FIXED', value: '', minAmount: '', startAt: '', endAt: '', totalQty: '' });

  const load = () => apiClient('/api/coupons').then((res: any) => setCoupons(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await apiClient('/api/coupons', { method: 'POST', body: JSON.stringify({ ...form, value: parseFloat(form.value), minAmount: form.minAmount ? parseFloat(form.minAmount) : 0, totalQty: parseInt(form.totalQty) }) });
    setShowForm(false); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">优惠券管理</h1>
        <Button onClick={() => setShowForm(true)}>新增优惠券</Button>
      </div>
      {showForm && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <input placeholder="优惠码" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full border rounded px-3 py-2" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="FIXED">固定金额</option>
            <option value="PERCENT">百分比</option>
          </select>
          <input type="number" placeholder="面值" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input type="number" placeholder="最低消费" value={form.minAmount} onChange={e => setForm({ ...form, minAmount: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input type="datetime-local" placeholder="开始时间" value={form.startAt} onChange={e => setForm({ ...form, startAt: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input type="datetime-local" placeholder="结束时间" value={form.endAt} onChange={e => setForm({ ...form, endAt: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input type="number" placeholder="总数量" value={form.totalQty} onChange={e => setForm({ ...form, totalQty: e.target.value })} className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2"><Button onClick={submit}>保存</Button><Button variant="outline" onClick={() => setShowForm(false)}>取消</Button></div>
        </div>
      )}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['优惠码', '类型', '面值', '已用/总量', '有效期', '状态'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{c.code}</td>
                <td className="px-4 py-3">{c.type === 'FIXED' ? '固定' : '百分比'}</td>
                <td className="px-4 py-3">{c.type === 'FIXED' ? `¥${c.value}` : `${c.value}%`}</td>
                <td className="px-4 py-3">{c.usedQty}/{c.totalQty}</td>
                <td className="px-4 py-3 text-xs">{new Date(c.startAt).toLocaleDateString()} ~ {new Date(c.endAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.isActive ? '有效' : '失效'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
