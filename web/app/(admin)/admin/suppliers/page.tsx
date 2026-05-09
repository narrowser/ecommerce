'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { apiClient } from '@/lib/api-client';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const load = () => apiClient('/api/suppliers').then((res: any) => setSuppliers(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const approve = async (id: string) => { await apiClient(`/api/suppliers/${id}/approve`, { method: 'PUT' }); load(); };
  const reject = async (id: string) => { await apiClient(`/api/suppliers/${id}/reject`, { method: 'PUT' }); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">供应商管理</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['公司', '联系人', '电话', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{s.companyName}</td>
                <td className="px-4 py-3">{s.contactName}</td>
                <td className="px-4 py-3">{s.contactPhone}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 space-x-1">
                  {s.status === 'PENDING' && <><Button size="sm" variant="outline" onClick={() => approve(s.id)}>通过</Button><Button size="sm" variant="outline" onClick={() => reject(s.id)}>拒绝</Button></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
