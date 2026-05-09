'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const load = () => apiClient('/api/products/mine').then((res: any) => setProducts(res.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的商品</h1>
        <Link href="/supplier/products/new"><Button>发布商品</Button></Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="border rounded-lg p-4 hover:shadow">
            <p className="font-medium">{p.name}</p>
            <p className="text-red-500 font-bold mt-1">¥{Number(p.price).toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">库存: {p.inventory?.stock || 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
