'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/pagination';
import { apiClient } from '@/lib/api-client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiClient(`/api/products?page=${page}`).then((res: any) => { setProducts(res.data); setTotal(res.total); }).catch(() => {});
  }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Link href="/admin/products/new"><Button>新增商品</Button></Link>
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['名称', '价格', '库存', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">¥{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.inventory?.stock || 0}</td>
                <td className="px-4 py-3">{p.isActive ? '上架' : '下架'}</td>
                <td className="px-4 py-3"><Link href={`/admin/products/${p.id}/edit`} className="text-primary text-sm">编辑</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center"><Pagination page={page} total={total} pageSize={20} onChange={setPage} /></div>
    </div>
  );
}
