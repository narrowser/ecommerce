import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gray-100 aspect-square flex items-center justify-center">
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm">暂无图片</span>}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-red-500 font-bold">¥{Number(product.price).toFixed(2)}</span>
          {product.comparePrice > 0 && <span className="text-xs text-gray-400 line-through">¥{Number(product.comparePrice).toFixed(2)}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-1">库存: {product.inventory?.stock || 0}</p>
      </div>
    </Link>
  );
}
