'use client';
import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/shared/status-badge';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = () => { apiClient(`/api/orders/admin?page=${page}`).then((res: any) => { setOrders(res.data); setTotal(res.total); }).catch(() => {}); };
  useEffect(() => { load(); }, [page]);

  const updateStatus = async (id: string, status: string) => {
    await apiClient(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['订单号', '状态', '金额', '时间', '操作'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{o.orderNo}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">¥{Number(o.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 space-x-1">
                  {o.status === 'PAID' && <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, 'SHIPPED')}>发货</Button>}
                  {o.status === 'PENDING_PAYMENT' && <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, 'CANCELLED')}>取消</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center"><Pagination page={page} total={total} pageSize={20} onChange={setPage} /></div>
    </div>
  );
}
