'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState('');

  useEffect(() => {
    apiClient('/api/cart').then((res: any) => setCart(res.data)).catch(() => {});
    apiClient('/api/addresses').then((res: any) => setAddresses(res.data)).catch(() => {});
  }, []);

  const submitOrder = async () => {
    const addr = addresses.find(a => a.id === selectedAddrId);
    if (!addr) return alert('请选择收货地址');
    try {
      const res: any = await apiClient('/api/orders', { method: 'POST', body: JSON.stringify({ shippingAddr: addr }) });
      router.push(`/orders/${res.data.id}`);
    } catch (e: any) { alert(e.message); }
  };

  if (!cart) return <div className="text-center py-20">加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">确认订单</h1>
      <div className="mb-6">
        <h2 className="font-medium mb-2">收货地址</h2>
        {addresses.map(addr => (
          <label key={addr.id} className={`block border rounded p-3 mb-2 cursor-pointer ${selectedAddrId === addr.id ? 'border-primary bg-primary/5' : ''}`}>
            <input type="radio" name="address" checked={selectedAddrId === addr.id} onChange={() => setSelectedAddrId(addr.id)} className="mr-2" />
            {addr.receiver} {addr.phone} — {addr.address} {addr.city}
          </label>
        ))}
        {addresses.length === 0 && <p className="text-gray-500">暂无地址，请先去个人中心添加</p>}
      </div>
      <div className="mb-6">
        <h2 className="font-medium mb-2">商品清单</h2>
        {cart.items?.map((item: any) => (
          <div key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>{item.productId} x{item.quantity}</span>
          </div>
        ))}
      </div>
      <Button onClick={submitOrder} className="w-full" size="lg" disabled={!selectedAddrId}>提交订单</Button>
    </div>
  );
}
