'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);

  const loadCart = () => apiClient('/api/cart').then((res: any) => setCart(res.data)).catch(() => {});

  useEffect(() => { loadCart(); }, []);

  const remove = async (itemId: string) => { await apiClient(`/api/cart/items/${itemId}`, { method: 'DELETE' }); loadCart(); };

  if (!cart) return <div className="text-center py-20">加载中...</div>;
  if (!cart.items?.length) return <div className="text-center py-20 text-gray-500">购物车为空，<Link href="/products" className="text-primary">去逛逛</Link></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>
      {cart.items.map((item: any) => (
        <div key={item.id} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0" />
            <div>
              <p className="font-medium">{item.productId}</p>
              <p className="text-sm text-gray-500">数量: {item.quantity}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>删除</Button>
        </div>
      ))}
      <div className="mt-6 text-right">
        <Link href="/checkout"><Button>去结算</Button></Link>
      </div>
    </div>
  );
}
