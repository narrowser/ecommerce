'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/status-badge';
import { Pagination } from '@/components/shared/pagination';
import { apiClient } from '@/lib/api-client';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiClient(`/api/orders/mine?page=${page}`).then((res: any) => { setOrders(res.data); setTotal(res.total); }).catch(() => {});
  }, [page]);

  if (orders.length === 0) return <div className="text-center py-20 text-gray-500">暂无订单</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>
      {orders.map(order => (
        <Link key={order.id} href={`/orders/${order.id}`} className="block border rounded-lg p-4 mb-3 hover:shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{order.orderNo}</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex justify-between">
            <span>共 {order.items.length} 件商品</span>
            <span className="font-bold text-red-500">¥{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </Link>
      ))}
      <Pagination page={page} total={total} pageSize={20} onChange={setPage} />
    </div>
  );
}
