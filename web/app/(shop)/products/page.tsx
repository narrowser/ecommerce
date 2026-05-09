'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/shop/product-card';
import { Pagination } from '@/components/shared/pagination';
import { apiClient } from '@/lib/api-client';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId] = useState(searchParams.get('categoryId') || '');

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: '20' });
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    apiClient(`/api/products?${params}`).then((res: any) => {
      setProducts(res.data);
      setTotal(res.total);
    }).catch(() => {});
  }, [page, search, categoryId]);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="搜索商品..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 flex-1" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination page={page} total={total} pageSize={20} onChange={setPage} />
      </div>
    </div>
  );
}
