'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => { apiClient(`/api/orders/${id}`).then((res: any) => setOrder(res.data)).catch(() => {}); }, [id]);

  const payOrder = async () => {
    const res: any = await apiClient('/api/payments', { method: 'POST', body: JSON.stringify({ orderId: order.id, amount: Number(order.totalAmount), method: 'ALIPAY' }) });
    await apiClient(`/api/payments/${res.data.id}/pay`, { method: 'POST' });
    location.reload();
  };

  if (!order) return <div className="text-center py-20">加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">订单详情</h1>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">{order.orderNo}</span>
        <StatusBadge status={order.status} />
      </div>
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="font-medium mb-3">商品信息</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>{item.productName || item.productId} x{item.quantity}</span>
            <span>¥{Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t">
          <span>合计</span>
          <span className="text-red-500">¥{Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>
      {order.status === 'PENDING_PAYMENT' && (
        <Button onClick={payOrder} className="w-full">立即支付 (模拟)</Button>
      )}
      {order.status === 'PAID' && <p className="text-green-600 text-center">支付成功，等待发货</p>}
      {order.status === 'SHIPPED' && <p className="text-blue-600 text-center">已发货，等待收货</p>}
    </div>
  );
}
