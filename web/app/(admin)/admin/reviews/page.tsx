'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  const load = () => apiClient('/api/reviews').then((res: any) => setReviews(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const deleteReview = async (id: string) => { await apiClient(`/api/reviews/${id}`, { method: 'DELETE' }); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">评价管理</h1>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="text-sm text-gray-500">商品: {r.productId}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteReview(r.id)}>删除</Button>
            </div>
            <p className="text-gray-700">{r.content}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">暂无评价</p>}
      </div>
    </div>
  );
}
