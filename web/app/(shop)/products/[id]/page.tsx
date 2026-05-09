'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    apiClient(`/api/products/${id}`).then((res: any) => setProduct(res.data)).catch(() => {});
    apiClient(`/api/reviews/product/${id}`).then((res: any) => setReviews(res.data)).catch(() => {});
  }, [id]);

  if (!product) return <div className="text-center py-20">加载中...</div>;

  const addToCart = async () => {
    try {
      await apiClient('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity }) });
      alert('已加入购物车');
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
          {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="object-cover rounded-lg" /> : <span className="text-gray-400">暂无图片</span>}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category?.name}</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl text-red-500 font-bold">¥{Number(product.price).toFixed(2)}</span>
            {product.comparePrice > 0 && <span className="text-lg text-gray-400 line-through">¥{Number(product.comparePrice).toFixed(2)}</span>}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
            <span className="text-lg w-8 text-center">{quantity}</span>
            <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div>
          <p className="text-sm text-gray-400 mb-4">库存: {product.inventory?.stock || 0}</p>
          <Button onClick={addToCart} className="w-full mb-4">加入购物车</Button>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">商品评价</h2>
        {reviews.length === 0 ? <p className="text-gray-500">暂无评价</p> :
          reviews.map((r: any) => (
            <div key={r.id} className="border-b py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{r.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
