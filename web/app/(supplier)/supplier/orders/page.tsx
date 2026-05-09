'use client';
import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/shared/status-badge';
import { apiClient } from '@/lib/api-client';

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { apiClient('/api/orders/supplier').then((res: any) => setOrders(res.data)).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单查看</h1>
      {orders.map(o => (
        <div key={o.id} className="border rounded-lg p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{o.orderNo}</span>
            <StatusBadge status={o.status} />
          </div>
          <div className="text-sm text-gray-700">
            {o.items.map((i: any) => <p key={i.id}>{i.productName || i.productId} x{i.quantity} - ¥{Number(i.subtotal).toFixed(2)}</p>)}
          </div>
        </div>
      ))}
    </div>
  );
}
